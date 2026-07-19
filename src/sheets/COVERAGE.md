# Sheets tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.

**This is a methods-only service.** When it shipped, Google published MCP
references only for Gmail, Drive, Calendar, Chat, and People, and the Sheets
MCP URL 404'd, so there is no `tools/` folder and the REST-sourced `methods/`
registry is the whole wire surface. Google has since published a Sheets MCP
toolset in developer preview (`sheetsmcp.googleapis.com`: `get_values`,
`get_spreadsheet`, `update_spreadsheet`, `update_values`, `update_formulas`,
`insert_dimension`; per
https://developers.google.com/workspace/sheets/api/reference/mcp, fetched
2026-07-18); reconciling this service with that toolset once it stabilizes is
tracked in issue #76.

- REST reference: `https://developers.google.com/workspace/sheets/api/reference/rest`
- Discovery: `https://sheets.googleapis.com/$discovery/rest?version=v4`

## Methods: REST reference (`methods/`, 39 operations)

| Resource | Implemented |
|----------|-------------|
| spreadsheets | `get_spreadsheet`, `create_spreadsheet`, `update_spreadsheet_properties` |
| spreadsheets (dimensions) | `insert_dimension`, `delete_dimension` ⚠️, `auto_resize_dimensions` |
| spreadsheets (named ranges) | `add_named_range`, `delete_named_range` ⚠️ |
| spreadsheets (formatting) | `repeat_cell`, `update_borders` |
| spreadsheets (conditional format rules) | `add_conditional_format_rule`, `update_conditional_format_rule`, `move_conditional_format_rule`, `delete_conditional_format_rule` ⚠️ |
| spreadsheets (data validation) | `set_data_validation`, `clear_data_validation` ⚠️ |
| spreadsheets (protected ranges) | `add_protected_range`, `update_protected_range`, `delete_protected_range` ⚠️ |
| spreadsheets (charts) | `add_chart`, `update_chart_spec`, `delete_embedded_object` ⚠️ |
| spreadsheets.values | `get_values`, `update_values`, `append_values`, `clear_values` ⚠️, `batch_get_values`, `batch_update_values`, `batch_clear_values` ⚠️, `batch_get_values_by_data_filter`, `batch_update_values_by_data_filter`, `batch_clear_values_by_data_filter` ⚠️ |
| spreadsheets.developerMetadata | `get_developer_metadata`, `search_developer_metadata` |
| spreadsheets.sheets | `copy_sheet`, `add_sheet`, `delete_sheet` ⚠️, `duplicate_sheet`, `update_sheet_properties` ⚠️ |

The batchUpdate-backed operations (`update_spreadsheet_properties` plus the
sheet management, dimension, named-range, formatting, conditional-format,
data-validation, protected-range, and chart rows)
are a curated subset of `spreadsheets.batchUpdate`'s 69 request types (the
reference page's request anchors, counted 2026-07-18; issue
#27): each is one purpose-named operation wrapping exactly one request, cited
to that request type's anchor on the batchUpdate reference page. Two pages
split into more than one operation where the halves' annotations differ, the
same split Drive's `files/update` page gets: `SetDataValidationRequest` is
`set_data_validation` (rule required) and `clear_data_validation` (the
no-rule form, a removal), and `UpdateConditionalFormatRuleRequest`'s oneof
is `update_conditional_format_rule` (replace) and
`move_conditional_format_rule` (reorder, which also needs `sheetId`). The
mask-deriving updates (`update_spreadsheet_properties`,
`update_sheet_properties`, `update_protected_range`, and `repeat_cell`)
build their REST field mask
from the properties actually provided, so an untouched property is never
reset by a too-wide mask, and an empty update is refused rather than sent.
The index-addressed operations are not
idempotent: `delete_dimension` repeats onto whatever shifted into its range,
and conditional format rules have no ID, so
`move_conditional_format_rule` and `delete_conditional_format_rule` repeat
onto whatever rule shifted into their index. The chart operations carry a curated
`ChartSpec` (the basic family and pie); the specialty chart types (bubble,
candlestick, org, histogram, waterfall, treemap, scorecard) and styling
fields are not carried, and `update_chart_spec` replaces the whole spec, as
the REST request does.

⚠️ = destructive (`destructiveHint`): the clears are removals, per the
annotation rubric in EXTENDING.md, and `update_sheet_properties` is the one
destructive update: shrinking gridProperties' rowCount or columnCount
truncates the grid and discards the cells beyond the new bounds. Updates and appends are not destructive,
matching Google's own classification of `update_event` (overwriting values is
an update, not a removal); `valueInputOption` is required on every write
because REST rejects writes without it.

Methods speak the REST vocabulary verbatim (`spreadsheetId`,
`valueInputOption`, `majorDimension`, `dateTimeRenderOption`); wire names
follow the suite's method naming (verb + resource noun):
`spreadsheets.values.batchGetByDataFilter` is
`batch_get_values_by_data_filter`.

## The Spreadsheet projection

`get_spreadsheet` and `create_spreadsheet` return a **metadata-only**
projection: `spreadsheetId`, `spreadsheetUrl`, properties (title, locale,
timeZone, autoRecalc), and each sheet flattened to its properties (sheetId,
title, index, sheetType, gridProperties' four counts, hidden, tab color),
plus the spreadsheet's named ranges. Grid data
(per-cell formatting, validation, notes), themes, and the default
cell format are not carried; cell contents flow through the values operations
as plain `CellValue` (`string | number | boolean | null`) 2D arrays. The API
omits `values` entirely for an empty range, and rows may be ragged; the
schemas say so.

The Sheets API also has **no delete**: removing a spreadsheet is Drive's
`files.delete`, outside this server's surface.

## Intentionally not exposed

- **`spreadsheets.batchUpdate` as a raw passthrough**: one endpoint whose
  body is a union of 69 request types (sheet management, formatting, charts,
  filters, ...). Transcribing the union does not fit the
  documentation-driven pattern; instead a curated subset ships as the
  purpose-named operations above (issue #27), and the remaining tail
  (filters, banding, merges, and the other data and layout requests) is
  tracked in issue #77.
- **Data-source condition variants**: `BooleanCondition`'s enum omits
  `TEXT_NOT_EQ`, `DATE_NOT_EQ`, and `FILTER_EXPRESSION`, which apply only to
  filters on data source (Connected Sheets) objects, a surface this server
  does not expose. `ProtectedRange`'s `tableId` backing is likewise not
  carried (tables are not part of this surface), and `protectedRangeId` /
  `requestingUserCanEdit` are output-only because REST marks them read-only.
- **`spreadsheets.getByDataFilter`** and the `includeGridData` /
  `excludeTablesInBandedRanges` parameters of `spreadsheets.get`: these exist
  to scope **grid data**, which the Spreadsheet projection excludes; without
  grid data they are `get_spreadsheet` with extra steps. Exposing grid data
  (a bounded `CellData` projection) is issue #28.

## Deferred

Tracked as issues, not missing by accident:

- **Grid data reads** (`includeGridData`, `getByDataFilter`, `CellData`
  projection): issue #28.
