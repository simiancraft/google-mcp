# @google-mcp/gmail

The Gmail MCP server, and the reference (canary) implementation for the
[google-mcp](../../README.md) pattern: `tools/` (verbs) and `entities/` (nouns),
both zod, composed by the shared [`@google-mcp/harness`](../../packages/mcp-harness)
factory over a [`@google-mcp/auth`](../../packages/google-auth) client.

## Layout

```
src/
  index.ts        # createServer({ name, scopes, tools, client })
  defineTool.ts   # makeDefineTool<gmail_v1.Gmail>()
  scopes.ts       # OAuth scopes
  tools/          # one folder per tool: schema.ts + handler.ts + handler.test.ts
  entities/       # PascalCase zod domain objects (Label, Thread, Draft, ...)
```

Tool vocabulary is lifted from Google's MCP reference pages
(`https://developers.google.com/workspace/gmail/api/reference/mcp`), used for
discovery only; the handlers reimplement over the Gmail REST API.

## Run

One instance per account, bound by env var:

```sh
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail        # serve
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail auth   # authorize the account
```
