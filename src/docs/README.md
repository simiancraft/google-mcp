# Docs server

The Docs MCP server, methods-only like [Sheets](../sheets/README.md): Google
publishes no MCP toolset for Docs, so the REST-sourced `methods/` registry is
the whole surface. Otherwise it is the same canary shape proven by
[Gmail](../gmail/README.md) for the [google-mcp-suite](../../README.md)
pattern: verbs over `entities/` (nouns), all zod, each an `operation()` from
the shared [`lib`](../lib) and served by `server()` over an
[`auth`](../auth) client.

## Capabilities

5 operations: document reads and creation (`get_document`,
`create_document`) plus a curated trio of text-editing operations
(`insert_text`, `replace_all_text`, `delete_content_range`), each wrapping
`documents.batchUpdate` with exactly one of its 40 request types; the rest
of the union is tracked in issue #35.

Documents read as **text with indices**: body blocks carry zero-based UTF-16
index ranges, which are exactly what the editing operations target; the
ranges shift on every edit, so re-read before computing new ones. Replaced
and deleted text is unrecoverable through the API (the MCP `destructiveHint`
marks both), and document deletion is Drive's `files.delete`, not part of
this surface. Grid-level riches (tabs, tables' cells, styles) are deferred,
see [`COVERAGE.md`](./COVERAGE.md).

The full, always-current operation list is
[`CAPABILITIES.md`](./CAPABILITIES.md), regenerated from the registry with
`bun run capabilities`. An MCP client discovers the live surface, with input
and output JSON Schema, from the server's `tools/list`.

## Layout (`src/docs/`)

```
index.ts        # server({ name, title, description, instructions, operations, client }); the bin entry
methods/        # REST-sourced ops; registry.ts + one folder per method
                #   <method>/ index.ts + handler.ts + schema.ts + handler.test.ts
entities/       # PascalCase zod domain objects (Document, Range, ...)
lib/            # projections (document) + the single batchUpdate wrapper (batch)
```

There is no `tools/` folder by construction; see
[`COVERAGE.md`](./COVERAGE.md). Scopes are not declared here; every account
is authorized once for the front-loaded union in [`auth`](../auth)
(`config.ts` `SCOPES`).

## Run

Point your MCP client at one instance per account:

```json
{
  "mcpServers": {
    "docs-personal": {
      "command": "google-mcp-docs",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "docs-work": {
      "command": "google-mcp-docs",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    }
  }
}
```

Or run it bare (debugging, smoke tests), bound by the same env var:

```sh
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-docs        # serve
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-docs auth   # authorize the account
```
