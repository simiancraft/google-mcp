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

## Methods: REST reference (`methods/`, 76 operations)

| Resource | Implemented |
|----------|-------------|
| spreadsheets | `get_spreadsheet`, `create_spreadsheet`, `update_spreadsheet_properties` |
| spreadsheets (layout and dimensions) | `insert_dimension`, `delete_dimension` ⚠️, `auto_resize_dimensions`, `update_dimension_properties`, `move_dimension`, `append_dimension`, `add_dimension_group`, `update_dimension_group`, `delete_dimension_group` ⚠️ |
| spreadsheets (named ranges) | `add_named_range`, `update_named_range`, `delete_named_range` ⚠️ |
| spreadsheets (formatting) | `repeat_cell`, `update_borders` |
| spreadsheets (banding) | `add_banding`, `update_banding`, `delete_banding` ⚠️ |
| spreadsheets (cell content, merges) | `update_cells` ⚠️, `merge_cells` ⚠️, `unmerge_cells` ⚠️ |
| spreadsheets (sorting and filters) | `sort_range`, `set_basic_filter`, `clear_basic_filter` ⚠️, `add_filter_view`, `update_filter_view`, `duplicate_filter_view`, `delete_filter_view` ⚠️ |
| spreadsheets (data operations) | `find_replace`, `delete_duplicates` ⚠️, `trim_whitespace` ⚠️, `text_to_columns` ⚠️, `auto_fill` ⚠️, `copy_paste` ⚠️, `cut_paste` ⚠️, `insert_range`, `delete_range` ⚠️, `randomize_range` |
| spreadsheets (conditional format rules) | `add_conditional_format_rule`, `update_conditional_format_rule`, `move_conditional_format_rule`, `delete_conditional_format_rule` ⚠️ |
| spreadsheets (data validation) | `set_data_validation`, `clear_data_validation` ⚠️ |
| spreadsheets (protected ranges) | `add_protected_range` ⚠️, `update_protected_range`, `delete_protected_range` ⚠️ |
| spreadsheets (charts and embedded objects) | `add_chart`, `update_chart_spec`, `update_embedded_object_position`, `update_embedded_object_border`, `delete_embedded_object` ⚠️ |
| spreadsheets (slicers) | `add_slicer`, `update_slicer_spec` |
| spreadsheets.values | `get_values`, `update_values`, `append_values`, `clear_values` ⚠️, `batch_get_values`, `batch_update_values`, `batch_clear_values` ⚠️, `batch_get_values_by_data_filter`, `batch_update_values_by_data_filter`, `batch_clear_values_by_data_filter` ⚠️ |
| spreadsheets.developerMetadata | `get_developer_metadata`, `search_developer_metadata`, `create_developer_metadata`, `update_developer_metadata`, `delete_developer_metadata` ⚠️ |
| spreadsheets.sheets | `copy_sheet`, `add_sheet`, `delete_sheet` ⚠️, `duplicate_sheet`, `update_sheet_properties` ⚠️ |

The batchUpdate-backed operations (`update_spreadsheet_properties` plus the
sheet management, layout and dimension, named-range, developer-metadata,
formatting, banding,
cell-content, sorting, filter, data-operation, conditional-format,
data-validation, protected-range, embedded-object, and slicer rows)
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
`update_sheet_properties`, `update_dimension_properties`,
`update_named_range`, `update_developer_metadata`, `update_protected_range`,
`update_filter_view`, `repeat_cell`,
`update_banding`, `update_embedded_object_position`, and
`update_embedded_object_border`, plus `update_slicer_spec`)
build their REST field mask
from the properties actually provided, so an untouched property is never
reset by a too-wide mask, and an empty update is refused rather than sent;
`update_filter_view` expands its structured range mask per provided subkey,
while its sort and filter specification arrays replace their complete lists.
A filter view has exactly one backing, however, so providing `range` or
`namedRangeId` detaches the other backing even though it was not provided.
`update_cells` derives its mask as the union of the fields its cells carry;
the REST request applies that mask to every written cell, so a masked field
a cell omits is cleared in that cell, which is why the operation is marked
destructive.
The index-addressed operations are not
idempotent: `delete_dimension`, `move_dimension`, and `delete_range` repeat onto whatever shifted
into their ranges, and `insert_range` repeats the insertion and shifts again,
and conditional format rules have no ID, so
`move_conditional_format_rule` and `delete_conditional_format_rule` repeat
onto whatever rule shifted into their index. `randomize_range` produces a new
order on every call, `cut_paste` has already cleared its source when repeated,
`copy_paste` can mutate an overlapping source, and `find_replace` can create
new matches when the replacement contains the find value, so those operations
are non-idempotent too. The chart operations carry all nine ordinary-grid
families: basic, pie, bubble, candlestick, org, histogram, waterfall, treemap,
and scorecard. The family-specific carrier decisions are exact:

- Basic charts carry chart type, legend position, axis position and title,
  domain data, series data, target axis and type, and header count. The decided
  exclusions are `compareMode`; domain `reversed`; axis `format`,
  `titleTextPosition`, and `viewWindowOptions`; series `colorStyle`,
  `lineStyle`, `pointStyle`, and `styleOverrides`; series `dataLabel` and
  `totalDataLabel`; and `stackedType`, `lineSmoothing`, `threeDimensional`, and
  `interpolateNulls`.
- Waterfall charts carry domain reversal, series data, modern column colors and
  labels, custom subtotals, trailing-subtotal visibility, stacking, first-value
  totals, and connector visibility. The decided exclusions are series
  `dataLabel`, `connectorLineStyle`, and `totalDataLabel`.
- Pie, bubble, candlestick, org, histogram, treemap, and scorecard charts carry
  all of their modern ordinary-grid REST fields. They have no family-specific
  exclusions. Deprecated `Color` aliases are not separate gaps because their
  replacement `ColorStyle` fields are carried.

The common `ChartSpec` carrier excludes the data-source-only
`dataSourceChartProperties`, `filterSpecs`, and `sortSpecs` fields. Its nested
`ChartData` carrier likewise excludes the data-source-only `groupRule`,
`aggregateType`, and `columnReference` fields. These are decided exclusions
with the data-source request family, not untracked chart cosmetics.
`update_chart_spec` replaces the whole spec, as the REST request does, so every
existing field outside these carriers is cleared by an update. Embedded-object
layout is separate:
`update_embedded_object_position` updates overlay fields behind a derived mask
and returns the projected new position (not idempotent: a newSheet move
creates a sheet with a newly chosen ID on every call), while
`update_embedded_object_border` updates its modern `colorStyle` border.

⚠️ = destructive (`destructiveHint`): the clears, banding and dimension-group
deletes, developer-metadata delete, and filter-view delete are removals, per the
annotation rubric in EXTENDING.md; `update_sheet_properties` is the one
destructive update: shrinking gridProperties' rowCount or columnCount
truncates the grid and discards the cells beyond the new bounds; and
`add_protected_range` is a destructive add under the rubric's
standing-side-effect cluster (the `create_filter` precedent): the protection
keeps restricting every collaborator not granted access. In the cell-content
and merges row, `merge_cells` discards every value but the upper-left of each merge,
`unmerge_cells` is a removal of the merge structure, and `update_cells`
clears masked fields in cells that omit them (and the uncovered remainder of
an explicit range). Other updates and appends are not destructive,
matching Google's own classification of `update_event` (overwriting values is
an update, not a removal); `valueInputOption` is required on every write
through the values operations because REST rejects those writes without it
(the batchUpdate-backed operations, `update_cells` included, have no such
field). Every operation here is closed-world (`openWorldHint: false`)
including the formula-bearing writes: a written formula can reach external
endpoints when the sheet later evaluates it (IMPORTDATA and friends, per
the formula hazards on those fields), but the hint tracks the operation's
own reach, uniformly with the values operations.

`delete_developer_metadata` can irreversibly remove every entry matching its
filter; the reply lists what was deleted, while the attached rows, columns,
sheets, and cell values remain. Metadata creation is additive and
non-idempotent because replay without an explicit ID creates another entry.
Metadata update is idempotent and applies one derived-mask change set to every
entry matching any filter.

The data-operation annotation judgments follow the same rubric explicitly.
`sort_range` and `randomize_range` reorder the row slices inside their
GridRanges (which may be column-bounded) and discard no content, so they are
non-destructive. `find_replace` overwrites matching text
with the replacement the caller supplied, like `update_values`, so it is also
non-destructive. `delete_duplicates` removes rows; `trim_whitespace` discards
characters; `text_to_columns` can overwrite cells beside its one-column
source; `auto_fill` overwrites its computed destination; `copy_paste`
overwrites destination fields; and `cut_paste` both clears its complete source
and overwrites its destination, so those six operations are destructive.
`insert_range` is additive, while `delete_range` removes cells and is
destructive. Setting or updating filters changes visibility/sort state without
discarding content; clearing the basic filter and deleting a filter view are
the removal halves and are destructive.
`get_values` is the read-back verification path for these content-transforming
operations because their batchUpdate replies return counts or metadata, not
the resulting cell data.

Exact dimension-property updates are non-destructive and idempotent.
`move_dimension` preserves the
rows or columns but is non-idempotent because its source is index-addressed;
`append_dimension` is additive and repeats another append. Adding a dimension
group is additive but can reshape overlapping group ranges and depths;
deleting one is a destructive removal and is non-idempotent because each call
decrements group depth over the range. `update_dimension_group` is a
non-destructive idempotent state update, though changing `collapsed` also
hides or reveals every dimension in that group. Banding add is additive,
banding update is a non-destructive idempotent masked property update, and
banding delete is an ID-addressed destructive removal. The embedded-object
position and border operations are non-destructive idempotent property
updates; the position operation exposes overlay move and resize plus both
object-sheet creation forms. Its field mask preserves omitted anchor, offset,
and size fields for overlay updates.
`UpdateDimensionPropertiesRequest.dataSourceSheetRange` remains outside the
curated surface with the data-source request families. The embedded-position
operation accepts `newPosition.sheetId` and `newPosition.newSheet` to create an
object sheet, as well as field-masked overlay moves and resizes.
Dimension-group add and delete replies are projected as all returned
`dimensionGroups` and fail loudly when Google omits that reply. Banding add
follows the add-with-reply precedent: it fails loudly without a returned
banded range and keeps the required add-reply `bandedRangeId` total when a
zero-valued ID is omitted.
Slicer add is additive and non-idempotent; its active criteria can change what
charts and pivot tables display without modifying source cells. Slicer spec
updates are non-destructive, idempotent, and masked per provided field. Moving
or resizing a slicer remains the embedded-object position operation.

Methods speak the REST vocabulary verbatim (`spreadsheetId`, `filterId`,
`bandedRangeId`, `dimensionGroup`, `objectId`, `newPosition`,
`valueInputOption`, `majorDimension`, `dateTimeRenderOption`); wire names
follow the suite's method naming (verb + resource noun):
`spreadsheets.values.batchGetByDataFilter` is
`batch_get_values_by_data_filter`.

## The Spreadsheet projection

`get_spreadsheet` and `create_spreadsheet` return a lean projection:
`spreadsheetId`, `spreadsheetUrl`, properties (title, locale,
timeZone, autoRecalc), and each sheet flattened to its properties (sheetId,
title, index, sheetType, gridProperties' four counts, hidden, tab color)
plus its sheet-level reactive collections: `basicFilter`, `filterViews` (each
carrying the stable `filterViewId` used directly by `update_filter_view` and as
the `filterId` for duplicate/delete), `protectedRanges` (each carrying
the ID the update and delete operations take) and `conditionalFormats` (in
rule order; the array position is the index the rule operations take),
`bandedRanges` (each with an optional ID or output-only reference), ordered
`rowGroups` and `columnGroups` (total range-and-depth readouts with no ID;
updates select by both while deletes take only a range), `slicers` (each with
the required `slicerId` used by `update_slicer_spec`), and `merges` (the
merged ranges), plus
the spreadsheet's named ranges. The
rule readout keeps its type fields as **open strings** rather than narrowed
enums: rules are addressed by index, so the readout must be total, and
dropping a rule over an unrecognized upstream value would silently renumber
every rule after it; the write path stays the closed enum. Filter-view readout
is likewise total at the collection level: every upstream view projects with
its required ID, and a table-backed view is retained while only its `tableId`
backing detail is omitted. Connected Sheets sort and filter carrier details
remain outside the write surface. Plain `spreadsheets.get` returns these
filters, banded ranges, dimension groups, and slicers directly on each Sheet resource;
no grid-data flag is required. Grid data
(per-cell formatting, validation, notes), themes, and the default
cell format are not carried; cell values flow through the values operations
as plain `CellValue` (`string | number | boolean | null`) 2D arrays, and
`update_cells` writes structured cell content. The API
omits `values` entirely for an empty range, and rows may be ragged; the
schemas say so.

The Sheets API also has **no delete**: removing a spreadsheet is Drive's
`files.delete`, outside this server's surface.

## Intentionally not exposed

- **`spreadsheets.batchUpdate` as a raw passthrough**: one endpoint whose
  body is a union of 69 request types (sheet management, formatting, charts,
  filters, ...). Transcribing the union does not fit the
  documentation-driven pattern; instead a curated subset ships as the
  purpose-named operations above (issue #27). What remains is excluded by
  decision: the data-source and table request families; `AppendCellsRequest`,
  because `append_values` covers ordinary appends and `update_cells` covers
  structured cell writes; `PasteDataRequest`, because the typed value,
  copy/cut, and text-to-columns operations avoid delegating delimiter or HTML
  parsing to the API; and pivot tables and chip runs within `CellData`.
- **CellData beyond cell content**: `update_cells` carries a curated
  `CellData` (value, note, format, text format runs, and hyperlinks via a
  run's link field or the cell-level textFormat.link). Pivot tables and chip
  runs are excluded by decision, and the data-source fields are not carried;
  per-cell `dataValidation` travels
  through `set_data_validation` instead; and the read-only fields
  (effective value and format, formatted value, hyperlink) are grid data
  (issue #28).
- **Data-source condition variants**: `BooleanCondition` now carries
  `FILTER_EXPRESSION` for filter criteria, but still omits
  `TEXT_NOT_EQ` and `DATE_NOT_EQ`, which apply only to filters on data
  source (Connected Sheets) objects, a surface this server does not expose.
  `ProtectedRange`'s `tableId` backing is likewise not carried (tables are
  not part of this surface), and `requestingUserCanEdit` is output-only
  because REST marks it read-only (`protectedRangeId` is writable on add,
  and `add_protected_range` accepts it).
- **Connected Sheets/table filters and color sorts**: filter writes carry
  range- or named-range-backed views, ordinary-grid `columnIndex` filter
  specifications, hidden values, BooleanCondition, and modern RGB color
  criteria. The deprecated criteria map is read as a fallback but is not
  written. `tableId`, `dataSourceColumnReference`, and the Connected Sheets
  condition variants remain deferred with that surface. SortSpec carries
  `dimensionIndex` and `sortOrder`; deprecated raw colors and modern
  foreground/background color-style sorting are deferred rather than adding
  another mutually exclusive sort mode in this section.
- **`spreadsheets.getByDataFilter`** and the `includeGridData` /
  `excludeTablesInBandedRanges` parameters of `spreadsheets.get`: these exist
  to scope **grid data**, which the Spreadsheet projection excludes; without
  grid data they are `get_spreadsheet` with extra steps. Exposing grid data
  (a bounded `CellData` projection) is issue #28.

## Deferred

Tracked as issues, not missing by accident:

- **Grid data reads** (`includeGridData`, `getByDataFilter`, `CellData`
  projection): issue #28.
