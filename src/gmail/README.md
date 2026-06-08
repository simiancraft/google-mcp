# Gmail server

The Gmail MCP server, and the reference (canary) implementation for the
[google-mcp-suite](../../README.md) pattern: `tools/` and `methods/` (verbs) over
`entities/` (nouns), all zod, composed by the shared [`harness`](../harness)
factory over an [`auth`](../auth) client.

## Capabilities

33 operations across threads, messages, drafts, labels, and filters: search and
read (`search_threads`, `get_thread`, `get_message`, `list_messages`), compose
and send (`create_draft`, `send_message`, `send_draft`), organize (labels,
`batch_modify_messages`, trash/untrash), attachments (`download_attachment`), and
account filters. Irreversible operations (send, permanent delete) carry the MCP
`destructiveHint`.

The full, always-current list is [`CAPABILITIES.md`](../../CAPABILITIES.md),
regenerated from the registries with `bun run capabilities`. An MCP client
discovers the live surface, with input and output JSON Schema, from the server's
`tools/list`.

## Layout (`src/gmail/`)

```
index.ts        # createServer({ name, tools, methods, client }); the bin entry
defineTool.ts   # makeDefineTool<gmail_v1.Gmail>()  (MCP-sourced ops)
defineMethod.ts # makeDefineTool<gmail_v1.Gmail>()  (REST-sourced ops)
tools/          # one folder per tool:   schema.ts + handler.ts + handler.test.ts
methods/        # one folder per method: same construction
entities/       # PascalCase zod domain objects (Label, Thread, Draft, ...)
lib/            # projections: REST entity -> documented shape
```

Scopes are not declared here; every account is authorized once for the
front-loaded union in [`auth`](../auth) (`config.ts` `SCOPES`).

Tool vocabulary is lifted from Google's MCP reference pages
(`https://developers.google.com/workspace/gmail/api/reference/mcp`), used for
discovery only; the handlers reimplement over the Gmail REST API.

## Run

One instance per account, bound by env var:

```sh
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail        # serve
GOOGLE_MCP_ACCOUNT=simiancraft google-mcp-gmail auth   # authorize the account
```
