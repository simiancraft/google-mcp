# Sheets server

The Sheets MCP server, and the suite's first **methods-only** service: Google
publishes no MCP toolset for Sheets, so the REST-sourced `methods/` registry
is the whole surface. Otherwise it is the same canary shape proven by
[Gmail](../gmail/README.md) and replicated by [Calendar](../calendar/README.md)
for the [google-mcp-suite](../../README.md) pattern: verbs over `entities/`
(nouns), all zod, each an `operation()` from the shared [`lib`](../lib) and
served by `server()` over an [`auth`](../auth) client.

## Capabilities

42 operations across spreadsheets, values, developer metadata, sheets, and
the batchUpdate surface: spreadsheet metadata and properties, single-range
and batch values, data-filter-addressed values, developer metadata reads,
sheet management (add, delete, duplicate, copy, properties), dimensions,
named ranges, formatting (`repeat_cell`, `update_borders`), conditional
format rules, data validation, protected ranges, cell content and merges
(`update_cells`, `merge_cells`, `unmerge_cells`), and charts. Every operation
carries the four MCP annotation hints; the removals, the discarding writes
(`merge_cells`, `update_cells`), and `add_protected_range` (a standing
restriction) are marked destructive (`destructiveHint`).

Cell data moves as plain 2D arrays of `string | number | boolean | null`;
spreadsheet metadata is a lean projection (grid data, formatting, and themes
are deferred, see [`COVERAGE.md`](./COVERAGE.md)). One caution on writes:
with `valueInputOption: USER_ENTERED`, a leading `=` becomes a live formula,
so writing untrusted content that way is a formula-injection risk
(`IMPORTRANGE` and friends can exfiltrate sheet data when the spreadsheet is
next opened); use `RAW` for content you do not control. The full, always-current
operation list is [`CAPABILITIES.md`](./CAPABILITIES.md), regenerated from the
registry with `bun run capabilities`. An MCP client discovers the live
surface, with input and output JSON Schema, from the server's `tools/list`.

## Layout (`src/sheets/`)

```
index.ts        # server({ name, title, description, instructions, operations, client }); the bin entry
methods/        # REST-sourced ops; registry.ts + one folder per method
                #   <method>/ index.ts + handler.ts + schema.ts + handler.test.ts
entities/       # PascalCase zod domain objects (Spreadsheet, ValueRange, ...)
lib/            # projections (spreadsheet, values, filters, metadata)
```

There is no `tools/` folder by construction; see
[`COVERAGE.md`](./COVERAGE.md). Scopes are not declared here; every account is
authorized once for the front-loaded union in [`auth`](../auth) (`config.ts`
`SCOPES`).

## Run

Point your MCP client at one instance per account:

```json
{
  "mcpServers": {
    "sheets-personal": {
      "command": "google-mcp-sheets",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "sheets-work": {
      "command": "google-mcp-sheets",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    }
  }
}
```

Or run it bare (debugging, smoke tests), bound by the same env var:

```sh
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-sheets        # serve
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-sheets auth   # authorize the account
```
