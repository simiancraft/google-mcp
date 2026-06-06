# @google-mcp/gmail

The Gmail MCP server, and the reference (canary) implementation for the
[google-mcp](../../README.md) pattern: `tools/` and `methods/` (verbs) over
`entities/` (nouns), all zod, composed by the shared
[`@google-mcp/harness`](../../packages/mcp-harness) factory over a
[`@google-mcp/auth`](../../packages/google-auth) client.

## Layout

```
src/
  index.ts        # createServer({ name, tools, methods, client })
  defineTool.ts   # makeDefineTool<gmail_v1.Gmail>()  (MCP-sourced ops)
  defineMethod.ts # makeDefineTool<gmail_v1.Gmail>()  (REST-sourced ops)
  tools/          # one folder per tool:   schema.ts + handler.ts + handler.test.ts
  methods/        # one folder per method: same construction
  entities/       # PascalCase zod domain objects (Label, Thread, Draft, ...)
  lib/            # projections: REST entity -> documented shape
```

Scopes are not declared here; every account is authorized once for the
front-loaded union in [`@google-mcp/auth`](../../packages/google-auth)
(`config.ts` `SCOPES`).

Tool vocabulary is lifted from Google's MCP reference pages
(`https://developers.google.com/workspace/gmail/api/reference/mcp`), used for
discovery only; the handlers reimplement over the Gmail REST API.

## Run

One instance per account, bound by env var:

```sh
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail        # serve
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail auth   # authorize the account
```
