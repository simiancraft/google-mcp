# Drive server

The Drive MCP server: Google's curated MCP toolset (all 8 tools, annotations
transcribed verbatim) plus the broader REST surface, in the same canary shape
proven by [Gmail](../gmail/README.md) for the
[google-mcp-suite](../../README.md) pattern: verbs over `entities/` (nouns),
all zod, each an `operation()` from the shared [`lib`](../lib) and served by
`server()` over an [`auth`](../auth) client.

## Capabilities

35 operations: the toolset's search, listing, metadata, permissions read,
text and base64 content, creation, and copying (`search_files`,
`list_recent_files`, `get_file_metadata`, `get_file_permissions`,
`read_file_content`, `download_file_content`, `create_file`, `copy_file`),
plus REST methods for file metadata and trash (`update_file`, `trash_file`,
`untrash_file`, `delete_file`, `empty_trash`), comments and replies (full
CRUD), revisions, shared drives, and the account's `get_about`.

The trash is the reversible lane: `trash_file`/`untrash_file` round-trip, and
Drive purges trash after about 30 days; `delete_file` and `empty_trash`
bypass it permanently (the MCP `destructiveHint` marks every removal).
Content crosses the wire as text or base64 within a 25 MiB boundary; bigger
media is deferred, see [`COVERAGE.md`](./COVERAGE.md), as are sharing writes
and the changes feed.

The full, always-current operation list is
[`CAPABILITIES.md`](./CAPABILITIES.md), regenerated from the registries with
`bun run capabilities`. An MCP client discovers the live surface, with input
and output JSON Schema, from the server's `tools/list`.

## Layout (`src/drive/`)

```
index.ts        # server({ name, title, description, instructions, operations, client }); the bin entry
tools/          # Google's MCP toolset reference; registry.ts + one folder per tool
methods/        # REST-sourced ops the toolset omits; same construction
                #   <operation>/ index.ts + handler.ts + schema.ts + handler.test.ts
entities/       # PascalCase zod domain objects (File, Comment, SharedDrive, ...)
lib/            # projections (file, comment, revision, shared-drive) + the
                # search-query translator (query) + the content boundary (content)
```

Scopes are not declared here; every account is authorized once for the
front-loaded union in [`auth`](../auth) (`config.ts` `SCOPES`).

## Run

Point your MCP client at one instance per account:

```json
{
  "mcpServers": {
    "drive-personal": {
      "command": "google-mcp-drive",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "drive-work": {
      "command": "google-mcp-drive",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    }
  }
}
```

Or run it bare (debugging, smoke tests), bound by the same env var:

```sh
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-drive        # serve
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-drive auth   # authorize the account
```
