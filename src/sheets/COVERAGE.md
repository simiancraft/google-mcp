# Sheets tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.

**Sheets has no MCP toolset.** Google publishes MCP references for Gmail,
Drive, Calendar, Chat, and People; Sheets is not among them (the obvious URL,
`developers.google.com/workspace/sheets/api/reference/mcp`, 404s). So this is
the suite's first **methods-only** service: there is no `tools/` folder, and
the REST-sourced `methods/` registry is the whole wire surface.

- REST reference: `https://developers.google.com/workspace/sheets/api/reference/rest`
- Discovery: `https://sheets.googleapis.com/$discovery/rest?version=v4`

## Methods: REST reference (`methods/`, 15 of 17)

| Resource | Implemented |
|----------|-------------|
| spreadsheets | `get_spreadsheet`, `create_spreadsheet` |
| spreadsheets.values | `get_values`, `update_values`, `append_values`, `clear_values` ⚠, `batch_get_values`, `batch_update_values`, `batch_clear_values` ⚠, `batch_get_values_by_data_filter`, `batch_update_values_by_data_filter`, `batch_clear_values_by_data_filter` ⚠ |
| spreadsheets.developerMetadata | `get_developer_metadata`, `search_developer_metadata` |
| spreadsheets.sheets | `copy_sheet` |

⚠ = destructive (`destructiveHint`): cleared values are unrecoverable through
the API. Updates and appends are not destructive (overwrite ≠ destroy,
following the Gmail and Calendar precedent); `valueInputOption` is required on
every write because REST rejects writes without it.

Methods speak the REST vocabulary verbatim (`spreadsheetId`,
`valueInputOption`, `majorDimension`, `dateTimeRenderOption`); wire names
follow the suite's method naming (verb + resource noun):
`spreadsheets.values.batchGetByDataFilter` is
`batch_get_values_by_data_filter`.

## The Spreadsheet projection

`get_spreadsheet` and `create_spreadsheet` return a **metadata-only**
projection: `spreadsheetId`, `spreadsheetUrl`, properties (title, locale,
timeZone, autoRecalc), and each sheet flattened to its properties (sheetId,
title, index, sheetType, gridProperties' four counts, hidden). Grid data
(per-cell formatting, validation, notes), tab colors, themes, and the default
cell format are not carried; cell contents flow through the values operations
as plain `CellValue` (`string | number | boolean | null`) 2D arrays. The API
omits `values` entirely for an empty range, and rows may be ragged; the
schemas say so.

The Sheets API also has **no delete**: removing a spreadsheet is Drive's
`files.delete`, outside this server's surface.

## Intentionally not exposed

- **`spreadsheets.batchUpdate`**: one endpoint whose body is a union of 69
  request types (sheet management, formatting, charts, filters, ...).
  Transcribing the union does not fit the documentation-driven pattern; a
  curated subset (add/delete/duplicate sheet, property updates, dimensions) is
  issue #27.
- **`spreadsheets.getByDataFilter`** and the `includeGridData` /
  `excludeTablesInBandedRanges` parameters of `spreadsheets.get`: these exist
  to scope **grid data**, which the Spreadsheet projection excludes; without
  grid data they are `get_spreadsheet` with extra steps. Exposing grid data
  (a bounded `CellData` projection) is issue #28.

## Deferred

Tracked as issues, not missing by accident:

- **Curated `batchUpdate` subset** (sheet management, then formatting):
  issue #27.
- **Grid data reads** (`includeGridData`, `getByDataFilter`, `CellData`
  projection): issue #28.
