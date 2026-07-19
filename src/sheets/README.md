# Sheets server

The Sheets MCP server, and the suite's first **methods-only** service: Google
publishes no MCP toolset for Sheets, so the REST-sourced `methods/` registry
is the whole surface. Otherwise it is the same canary shape proven by
[Gmail](../gmail/README.md) and replicated by [Calendar](../calendar/README.md)
for the [google-mcp-suite](../../README.md) pattern: verbs over `entities/`
(nouns), all zod, each an `operation()` from the shared [`lib`](../lib) and
served by `server()` over an [`auth`](../auth) client.

## Capabilities

76 operations across spreadsheets, values, developer metadata, sheets, and
the batchUpdate surface: spreadsheet metadata and properties, single-range
and batch values, data-filter-addressed values, developer metadata reads and writes,
sheet management (add, delete, duplicate, copy, properties), dimension layout
(exact sizes, visibility, moves, appends, groups), named ranges, formatting
(`repeat_cell`, `update_borders`), banding, conditional
format rules, data validation, protected ranges, cell content and merges
(`update_cells`, `merge_cells`, `unmerge_cells`), sorting, basic filters and
filter views, find/replace, deduplication, whitespace trimming, text-to-columns,
autofill, copy/cut paste, cell-range insertion/deletion, randomization, charts,
all ordinary-grid chart families, slicers, and embedded-object position and borders. Every operation
carries the four MCP annotation hints. The destructive set is the standing
restriction `add_protected_range`; the content-discarding writes
`auto_fill`, `copy_paste`, `cut_paste`, `delete_duplicates`, `merge_cells`,
`text_to_columns`, `trim_whitespace`, and `update_cells`; the grid-shrinking
`update_sheet_properties`; and the removals/clears `batch_clear_values`,
`batch_clear_values_by_data_filter`, `clear_basic_filter`,
`clear_data_validation`, `clear_values`, `delete_conditional_format_rule`,
`delete_dimension`, `delete_embedded_object`, `delete_filter_view`,
`delete_developer_metadata`, `delete_named_range`, `delete_protected_range`, `delete_range`, `delete_sheet`,
`delete_banding`, `delete_dimension_group`, and `unmerge_cells`
(`destructiveHint`).

Cell values move as plain 2D arrays of `string | number | boolean | null`
through the values operations, and `update_cells` writes structured cell
content (typed values, notes, formats, rich text runs with links);
spreadsheet metadata is a lean projection that includes banded ranges,
ordered row and column groups, and slicers (grid data reads and themes
are deferred, see [`COVERAGE.md`](./COVERAGE.md)). One caution on writes:
with `valueInputOption: USER_ENTERED`, a leading `=` becomes a live formula,
so writing untrusted content that way is a formula-injection risk
(`IMPORTRANGE` and friends can exfiltrate sheet data when the spreadsheet is
next opened); use `RAW` for content you do not control. The served instructions
cover formula-bearing find/replace and paste behavior; `find_replace` keeps its
field-level execution note on `includeFormulas`.
The full, always-current
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
