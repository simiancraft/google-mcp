# Extending google-mcp-suite

How to add a tool, an entity, or a whole service. The pattern is fixed on
purpose: every tool is a folder, every service is the same shape, and all
vocabulary is sourced from Google's docs. Gmail (`src/gmail`) is the worked
reference. It is one package: `auth`, `lib`, and each service are folders
under `src/` that import each other by relative path and compile to one `dist/`.

This file is the per-file recipe. For the end-to-end project playbook of
shipping a whole service (survey, plan, commit cadence, deferral issues, docs
checklist, live verification, and the operational matrix), see
[ADDING-A-SERVICE.md](./ADDING-A-SERVICE.md).

## The shape

```
src/
  auth/         # authorizedClient(account) + runAuthFlow(account); never reimplement auth
  lib/          # operation() + server(): the two MCP primitives; never reimplement the server
  <svc>/        # one folder per service (gmail, calendar, ...)
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
6. **`handler.test.ts`:** feed a stub client to `handler` (a hand-rolled fake
   that captures params; never the network), assert the exact Google params per
   input shape, assert the projection, and `schema.output.parse(result)`.
7. **Register** it in `tools/registry.ts`.
8. `bun run check`, then verify live against a real account (see
   [Live verification](#live-verification)).

## Tools vs methods

`tools/` mirrors Google's **MCP toolset** reference (its word: "tools").
`methods/` covers the broader **REST** reference (its word: "Methods"), the
operations the MCP toolset omits. Identical construction; both are `operation()`
definitions. The server merges both into one wire surface (via
`mergeOperations(tools, methods)`), so on the MCP wire everything is a "tool".

The split is **intentional and load-bearing, not just organizational.** MCP's
toolset alone cannot fully drive a Google service; `methods/` is how the suite
goes past it to fully instrument an account. The two folders mirror Google's own
two reference trees (MCP vs REST), which keeps provenance obvious and makes the
surface self-documenting. It also enables **documentation-driven updates**: a
reference page maps one-to-one onto a `schema.ts`/`handler.ts`/`index.ts` triple,
so "here is the page, make the files" is a bounded, repeatable unit of work. The
merge throws on a duplicate wire name (`mergeOperations`), so the only real hazard
of the split, a tool and a method colliding on one key, fails loudly rather than
silently dropping an operation.

Add a method exactly like a tool, but source `schema.ts` from the REST method
page (`…/reference/rest/v<n>/<resource>/<method>`; Gmail is v1, Calendar v3,
Sheets v4).

Where Google publishes no MCP toolset at all (Sheets; its MCP-supported
products are Gmail, Drive, Calendar, Chat, and People), the service is
**methods-only**: no `tools/` folder, `index.ts` serves
`mergeOperations(methods)`, and `capabilities.ts` renders a single
`REST Method` section. The service's COVERAGE.md leads with why.

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
3. `index.ts`: `server({ name, operations: mergeOperations(tools, methods),
   client: async (a) => <svc>({ version, auth: await authorizedClient(a) }),
   runAuth: runAuthFlow })`
   (`import { server } from '../lib/server.js'`,
   `import { mergeOperations } from '../lib/operation.js'`,
   `import { authorizedClient, runAuthFlow } from '../auth/oauth.js'`,
   `import { <svc> } from '@googleapis/<svc>'`,
   `import { tools } from './tools/registry.js'`,
   `import { methods } from './methods/registry.js'`). The operation's client
   type is inferred from each handler's first parameter; there is no per-service
   factory to bind. `mergeOperations` throws if a tool and a method share a wire
   name. The server's `version` defaults to the package version, so do not pass it.
4. Stamp tools (above), one per page on the service's MCP reference (or, where
   Google publishes no MCP page, from the REST reference). Track gaps in a
   `COVERAGE.md`.

**Per-client identity is a solved pattern; do not re-solve it.** A service that
needs "who am I" (Gmail's sender address) should look it up once and memoize per
client, as `src/gmail/lib/profile.ts` does with a `WeakMap`, rather than fetching
it on every operation.

## Live verification

Unit tests never touch the network, so every operation is also verified once
against a real account, tracked per service in an **operational-matrix issue**
(a live + unit checkbox per operation; Gmail is #7, Calendar is #22, Sheets
is #29).

Live passes are **pairwise**: pair every destructive operation with its
antecedent, so the only data ever destroyed is test data the pass itself made,
and the account ends in the state it was found.

- Delete something? Create that something first, then delete it, then **confirm
  it gone**. The confirmation signal is API-specific: a deleted event fetches
  back with `status=cancelled`; a deleted calendar vanishes from the calendar
  list (though `calendars.get` may serve a tombstone briefly after deletion).
- Create something? Delete it before the pass ends.
- Reads verify as-is; they have no state to restore.
- Subscribe/unsubscribe pairs use public data (a public holiday calendar, for
  example), never entries the user relies on.
- When the API pins a destructive operation to a surface you did not create
  (`calendars.clear` accepts only the primary calendar), verify the rejection
  path with self-made data and document in the matrix issue why the success
  path is deferred. Do not attempt lossy snapshot-and-restore on real data.

Record a **proof line** per operation in the matrix issue: what was created and
destroyed, the ids, and the date. For example: *created disposable calendar
c_e7e3…, deleted, confirmed gone from the calendar list on 6/10/2026*.

Mechanics: drive the built server over real stdio with the MCP SDK client
(`StdioClientTransport` against `dist/<svc>/index.js`,
`GOOGLE_MCP_ACCOUNT=<account>`), so the pass exercises the same wire surface an
agent uses, schemas and projections included.

## Run

One instance per account:

```sh
GOOGLE_MCP_ACCOUNT=<account> google-mcp-<svc>        # serve
GOOGLE_MCP_ACCOUNT=<account> google-mcp-<svc> auth   # authorize the account
```

Credentials live outside the repo: `~/.google-mcp/client_secret.json` (shared
OAuth app) and `~/.google-mcp/tokens/<account>.json` (per account, 0600).
