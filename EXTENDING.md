# Extending google-mcp-suite

How to add a tool, an entity, or a whole service. The pattern is fixed on
purpose: every tool is a folder, every service is the same shape, and all
vocabulary is sourced from Google's docs. Gmail (`src/gmail`) is the worked
reference. It is one package: `auth`, `lib`, and each service are folders
under `src/` that import each other by relative path and compile to one `dist/`.

## The shape

```
src/
  auth/         # authorizedClient(account) + runAuthFlow(account); never reimplement auth
  lib/          # operation() + server(): the two MCP primitives; never reimplement the server
  <svc>/        # one folder per service (gmail, drive, ...)
    index.ts        # server({ name, operations, client }); the bin entry
    entities/       # PascalCase zod nouns (Label.ts, Thread.ts, ...)
    lib/            # projection helpers (REST entity -> documented shape)
    tools/          # mirror the MCP toolset reference
      registry.ts   # the registry: { tool_name, ... } (key = wire name)
      <tool_name>/  # snake_case, verbatim from Google
        schema.ts        # export const schema = { input, output } (zod; compose entities)
        handler.ts       # the work: a standalone handler(client, args)
        index.ts         # export const <tool_name> = operation({ description, schema, handler })
        handler.test.ts  # mocked-client unit test
    methods/        # cover the REST reference (same construction as tools/)
      registry.ts
      <method_name>/ { schema.ts, handler.ts, index.ts, handler.test.ts }
```

A service imports `lib` and `auth` by relative path (`../lib/server.js`,
`../lib/operation.js`, `../auth/oauth.js`). Each operation is three files:
`schema.ts` is the contract (regenerable from the docs), `handler.ts` is the work
(the REST call + projection), and `index.ts` is the definition that binds them
with `operation()`. Keep them split.

## Add a tool

1. **Find the page.** `…/reference/mcp/tools_list/<tool_name>`. Note its input
   schema, output schema, and any `object (X)` it references.
2. **Make the folder** `tools/<tool_name>/` (snake_case, exactly the wire name).
3. **`schema.ts`:** export `const schema = { input, output }`, mirroring the
   documented input/output as zod; reference entities for named objects; keep
   inline primitives inline. Cite the source URL.
4. **`handler.ts`:** `export async function handler(client, args) { … }`, typed
   `args: z.infer<typeof schema.input>` and returning `z.infer<typeof
   schema.output>`. The handler calls the REST method and **projects** the
   response into the output shape (rename/select fields; the docs' shape, not the
   raw entity). Reuse `lib/` projections.
5. **`index.ts`:** `export const <tool_name> = operation({ description, schema,
   handler })`. `operation()` is a typed identity function; it infers the client
   from the handler's first parameter and the input/output from the schema.
6. **`handler.test.ts`:** feed a mocked client to `handler`, assert the projection
   and `schema.output.parse(result)`.
7. **Register** it in `tools/registry.ts`.
8. `bun run check`, then verify live against a real account.

## Tools vs methods

`tools/` mirrors Google's **MCP toolset** reference (its word: "tools").
`methods/` covers the broader **REST** reference (its word: "Methods"), the
operations the MCP toolset omits. Identical construction; both are `operation()`
definitions. The server merges both into one wire surface (`operations: {
...tools, ...methods }`), so the split is organizational, not a runtime
difference; on the MCP wire everything is a "tool".

Add a method exactly like a tool, but source `schema.ts` from the REST method
page (`…/reference/rest/v1/<resource>/<method>`).

Mark with `destructive: true` any operation that is irreversible (`send`,
permanent `delete`, `batchDelete`, `obliterate`) **or** establishes a persistent
dangerous side effect (e.g. `create_filter`: a forward/auto-delete filter keeps
acting on mail after the call). The server surfaces these as MCP
`destructiveHint`. `trash`/`untrash` are reversible with no standing effect, so
**not** destructive.

**Output crosses the wire as JSON.** Every result is JSON-serialized (a `text`
block plus `structuredContent`); there is no binary or streaming channel. Binary
payloads (e.g. attachment bytes from `download_attachment`) are base64url-encoded
into a JSON string field, by design. A service that needs native blob output
extends `lib` (`server`/`callOperation`), not a single operation.

## Add an entity

When a tool's schema references `object (X)`, add `entities/X.ts`:

```ts
import { z } from 'zod';
export const X = z.object({ id: z.string().describe('…, from the docs') });
export type X = z.infer<typeof X>;
```

Follow the chain: if `X` references `object (Y)`, add `entities/Y.ts` too. Open
`entities/` and it should be the complete catalog of the service's nouns.

**Doc comments are sourced too.** Give the entity a TSDoc comment from the API
guides **Concepts** page (Google's own definition of the noun) with an `@see`
link. Put **field-level** docs in `.describe()`, not JSDoc: the server emits the
schema with `z.toJSONSchema`, which carries `.describe()` text into the wire JSON
Schema, so an MCP client (and the LLM reading it at tool-selection time) sees the
field docs; JSDoc on a field never reaches the wire. Source the field text from
the tool/REST reference.

## Add a service

1. **Make the folder** `src/<svc>/`. Add the per-API client
   `@googleapis/<svc>` to the root `package.json` dependencies (not the
   `googleapis` monolith; it loads ~900 modules per process at startup), and a
   `bin` entry `"google-mcp-<svc>": "./dist/<svc>/index.js"`.
2. Add the service's scopes to the shared `SCOPES` union in `src/auth/config.ts`
   so each account is authorized once. Services do not declare scopes locally.
3. `index.ts`: `server({ name, operations: { ...tools, ...methods }, client:
   async (a) => <svc>({ version, auth: await authorizedClient(a) }), runAuth:
   runAuthFlow })`
   (`import { server } from '../lib/server.js'`,
   `import { authorizedClient, runAuthFlow } from '../auth/oauth.js'`,
   `import { <svc> } from '@googleapis/<svc>'`,
   `import { tools } from './tools/registry.js'`,
   `import { methods } from './methods/registry.js'`). The operation's client
   type is inferred from each handler's first parameter; there is no per-service
   factory to bind.
4. Stamp tools (above), one per page on the service's MCP reference (or, where
   Google publishes no MCP page, from the REST reference). Track gaps in a
   `COVERAGE.md`.

## Run

One instance per account:

```sh
GOOGLE_MCP_ACCOUNT=<account> google-mcp-<svc>        # serve
GOOGLE_MCP_ACCOUNT=<account> google-mcp-<svc> auth   # authorize the account
```

Credentials live outside the repo: `~/.google-mcp/client_secret.json` (shared
OAuth app) and `~/.google-mcp/tokens/<account>.json` (per account, 0600).
