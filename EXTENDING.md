# Extending google-mcp-suite

How to add a tool, an entity, or a whole service. The pattern is fixed on
purpose: every tool is a folder, every service is the same shape, and all
vocabulary is sourced from Google's docs. Gmail (`src/gmail`) is the worked
reference. It is one package: `auth`, `harness`, and each service are folders
under `src/` that import each other by relative path and compile to one `dist/`.

## The shape

```
src/
  auth/         # authorizedClient(account) + runAuthFlow(account); never reimplement auth
  harness/      # makeDefineTool<Client>() + createServer(...); never reimplement the server
  <svc>/        # one folder per service (gmail, drive, ...)
    index.ts        # createServer({ name, tools, methods, client }); the bin entry
    defineTool.ts   # makeDefineTool<<svc>_vN.Client>()  (MCP-sourced ops)
    defineMethod.ts # makeDefineTool<<svc>_vN.Client>()  (REST-sourced ops)
    entities/       # PascalCase zod nouns (Label.ts, Thread.ts, ...)
    lib/            # projection helpers (REST entity -> documented shape)
    tools/          # mirror the MCP toolset reference
      index.ts      # the registry: { tool_name, ... } (key = wire name)
      <tool_name>/  # snake_case, verbatim from Google
        schema.ts        # export const input, output (zod; compose entities)
        handler.ts       # the work + defineTool(...); exports the tool
        handler.test.ts  # mocked-client unit test
    methods/        # cover the REST reference (same construction as tools/)
      index.ts
      <method_name>/ { schema.ts, handler.ts, handler.test.ts }
```

A service imports the harness and auth by relative path (`../harness/index.js`,
`../auth/index.js`). `schema.ts` is the contract (regenerable from the docs);
`handler.ts` is the work (the REST call + projection). Keep them split.

## Add a tool

1. **Find the page.** `…/reference/mcp/tools_list/<tool_name>`. Note its input
   schema, output schema, and any `object (X)` it references.
2. **Make the folder** `tools/<tool_name>/` (snake_case, exactly the wire name).
3. **`schema.ts`:** mirror the documented input/output as zod; reference entities
   for named objects; keep inline primitives inline. Cite the source URL.
4. **`handler.ts`:** `export const <tool_name> = defineTool({ description, input,
   output, handler })`. The handler calls the REST method and **projects** the
   response into the output shape (rename/select fields; the docs' shape, not the
   raw entity). Reuse `lib/` projections.
5. **`handler.test.ts`:** feed a mocked client, assert the projection and
   `output.parse(result)`.
6. **Register** it in `tools/index.ts`.
7. `bun run check`, then verify live against a real account.

## Tools vs methods

`tools/` mirrors Google's **MCP toolset** reference (its word: "tools").
`methods/` covers the broader **REST** reference (its word: "Methods"), the
operations the MCP toolset omits. Identical construction; a method imports
`defineMethod` instead of `defineTool` (same factory, REST vocabulary). The
server merges both into one wire surface, so the split is organizational, not a
runtime difference.

Add a method exactly like a tool, but source `schema.ts` from the REST method
page (`…/reference/rest/v1/<resource>/<method>`) and import `defineMethod`.

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
extends the harness (`createServer`/`callTool`), not a single operation.

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
link. Put **field-level** docs in `.describe()`, not JSDoc: the harness emits the
schema with `z.toJSONSchema`, which carries `.describe()` text into the wire JSON
Schema, so an MCP client (and the LLM reading it at tool-selection time) sees the
field docs; JSDoc on a field never reaches the wire. Source the field text from
the tool/REST reference.

## Add a service

1. **Make the folder** `src/<svc>/`. Add the per-API client
   `@googleapis/<svc>` to the root `package.json` dependencies (not the
   `googleapis` monolith; it loads ~900 modules per process at startup), and a
   `bin` entry `"google-mcp-<svc>": "./dist/<svc>/index.js"`.
2. `defineTool.ts`: `export const defineTool = makeDefineTool<<svc>_vN.Client>()`
   (`import { makeDefineTool } from '../harness/index.js'`,
   `import type { <svc>_vN } from '@googleapis/<svc>'`). Same for `defineMethod.ts`.
3. Add the service's scopes to the shared `SCOPES` union in `src/auth/config.ts`
   so each account is authorized once. Services do not declare scopes locally.
4. `index.ts`: `createServer({ name, tools, methods, client: async (a) =>
   <svc>({ version, auth: await authorizedClient(a) }) })`
   (`import { createServer } from '../harness/index.js'`,
   `import { authorizedClient, runAuthFlow } from '../auth/index.js'`,
   `import { <svc> } from '@googleapis/<svc>'`).
5. Stamp tools (above), one per page on the service's MCP reference (or, where
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
