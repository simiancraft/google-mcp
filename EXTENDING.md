# Extending google-mcp

How to add a tool, an entity, or a whole service. The pattern is fixed on
purpose: every tool is a folder, every service is the same shape, and all
vocabulary is sourced from Google's docs. Gmail (`services/gmail`) is the
worked reference.

## The shape

```
packages/
  google-auth/    # authorizedClient(account) + runAuthFlow(account)  — never reimplement auth
  mcp-harness/    # makeDefineTool<Client>() + createServer(...)        — never reimplement the server
services/<svc>/src/
  index.ts        # createServer({ name, scopes, tools, client })
  defineTool.ts   # makeDefineTool<<svc>_vN.Client>()
  scopes.ts       # the service's OAuth scopes
  entities/       # PascalCase zod nouns (Label.ts, Thread.ts, ...)
  lib/            # projection helpers (REST entity -> documented shape)
  tools/
    index.ts      # the registry: { tool_name, ... } (key = wire name)
    <tool_name>/  # snake_case, verbatim from Google
      schema.ts        # export const input, output (zod; compose entities)
      handler.ts       # the work + defineTool(...); exports the tool
      handler.test.ts  # mocked-client unit test
```

`schema.ts` is the contract (regenerable from the docs); `handler.ts` is the
work (the REST call + projection). Keep them split.

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

## Add an entity

When a tool's schema references `object (X)`, add `entities/X.ts`:

```ts
import { z } from 'zod';
export const X = z.object({ /* fields, verbatim from the docs, with comments */ });
export type X = z.infer<typeof X>;
```

Follow the chain: if `X` references `object (Y)`, add `entities/Y.ts` too. Open
`entities/` and it should be the complete catalog of the service's nouns.

## Add a service

1. `services/<svc>/` with `package.json` (deps `@google-mcp/auth`,
   `@google-mcp/harness`, `googleapis`, `zod`; bin `google-mcp-<svc>`), `tsconfig.json`.
2. `defineTool.ts`: `export const defineTool = makeDefineTool<<svc>_vN.Client>()`.
3. `scopes.ts`: the service's scopes. Add them to the shared `SCOPES` union in
   `packages/google-auth/src/config.ts` so each account is authorized once.
4. `index.ts`: `createServer({ name, scopes, tools, client: async (a) =>
   google.<svc>({ version, auth: await authorizedClient(a) }) })`.
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
