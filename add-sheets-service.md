# Plan: the Sheets service

Self-destructs on ship (the last commit of this sequence deletes it).

## Goal

`google-mcp-sheets` serves the practical Google Sheets v4 surface: 15
operations over real stdio, all sourced from the REST reference, with
`bun run check` green (100% coverage), the doctor probing Sheets live-green
per account, docs shipped (COVERAGE.md, service README, root README row and
icon, AGENTS.md, package metadata), and the two hostile surfaces deferred as
issues #27 (the 69-variant `batchUpdate` union) and #28 (grid data reads).
Live pairwise verification runs against all three accounts and is recorded
in a new operational matrix issue with proof lines. Sheets is the first
**methods-only** service: Google publishes no MCP toolset for Sheets, so
`tools/` does not exist and COVERAGE.md says why.

## Survey (2026-06-10)

- MCP toolset: **none**. `developers.google.com/workspace/sheets/api/reference/mcp`
  404s; Google's MCP-supported products are Gmail, Drive, Calendar, Chat,
  People. All operations are REST-sourced `methods/`.
- Discovery: `https://sheets.googleapis.com/$discovery/rest?version=v4`
  (revision 20260608). 17 methods across 4 resources (`spreadsheets`,
  `spreadsheets.values`, `spreadsheets.developerMetadata`,
  `spreadsheets.sheets`).
- REST reference root:
  `https://developers.google.com/workspace/sheets/api/reference/rest`
- Scope: `https://www.googleapis.com/auth/spreadsheets` is already in the
  `SCOPES` union (src/auth/config.ts) and attributed in
  `src/doctor/services.ts`; tokens already carry it. No console work, no
  re-consent.
- No watch channels, no media upload/download, no LROs anywhere in the
  surface. Simplest service so far.

## Domain context (the traps, decided now)

1. **Methods-only shape.** No MCP toolset → no `tools/` folder, no
   `tools/registry.ts`. `index.ts` passes `mergeOperations(methods)`;
   `capabilities.ts` renders a single `REST Method` section. COVERAGE.md
   leads with why. This is the first service with this shape; the playbook
   gains a note.
2. **Cell values are loose JSON scalars.** A cell crosses the wire as
   `string | number | boolean | null` (`CellValue` entity). The `values`
   grid is `CellValue[][]`, rows may be ragged, and the API omits the
   `values` field entirely for an empty range, so every `values` output is
   optional.
3. **`valueInputOption` is required on every write** (`update_values`,
   `append_values`, both batch updates). The REST call 400s without it.
   Required in our schemas too: `RAW | USER_ENTERED`, no default, the
   `*_UNSPECIFIED` enum variants are never exposed.
4. **The Spreadsheet projection excludes grid data.** `get_spreadsheet`
   returns identity + properties + per-sheet properties
   (`spreadsheetId`, `spreadsheetUrl`, `properties{title, locale, timeZone,
   autoRecalc}`, `sheets[].{sheetId, title, index, sheetType,
   gridProperties{rowCount, columnCount, frozenRowCount, frozenColumnCount},
   hidden}`). Cell data flows through `values.*` as 2D arrays.
   `includeGridData` and `spreadsheets.getByDataFilter` are not exposed
   (issue #28); `excludeTablesInBandedRanges` falls with them.
5. **Sheets has no delete.** Spreadsheet deletion is Drive's
   `files.delete`. The service ships no delete operation, and the live
   pass cleans up its disposable spreadsheet with a direct Drive API call
   from the verification script (the `drive` scope is already in the
   union); the matrix issue documents this.
6. **The doctor probe has no id-free read.** Every Sheets read requires a
   `spreadsheetId`; there is no `list`. The probe does `spreadsheets.get`
   on Google's long-stable public sample sheet (docs "Class Data",
   `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`) and returns its title.
   If Google unpublishes it the probe fails loudly and the id gets
   replaced; the tradeoff is commented at the probe.
7. **`append_values` searches, then writes.** Its `range` names where to
   look for an existing table; the write lands after the detected table,
   not at the range. `.describe()` says so; the live pass confirms.
8. **Naming.** Wire names follow Calendar's method naming (verb +
   resource noun): `create_spreadsheet`, `get_values`,
   `batch_get_values_by_data_filter`, `copy_sheet`. Parameter vocabulary
   is REST's, verbatim camelCase: `spreadsheetId`, `valueInputOption`,
   `majorDimension`, `dateTimeRenderOption`.
9. **Destructive set is exactly the three clears** (`clear_values`,
   `batch_clear_values`, `batch_clear_values_by_data_filter`): cleared
   values are unrecoverable through the API. Updates and appends follow
   the Gmail/Calendar precedent (overwrite ≠ destructive).
10. **No A1 helper after all.** The survey predicted a `lib/` A1-notation
    composition; no shipped operation computes A1 (ranges pass through
    verbatim), so none is built. `lib/` holds projections only.

## The operation list (methods/, 15)

| Wire name | REST method | Body / params worth care | Returns |
|---|---|---|---|
| `create_spreadsheet` | `spreadsheets.create` | curated body: title, locale?, timeZone?, sheet titles? | Spreadsheet (projection) |
| `get_spreadsheet` | `spreadsheets.get` | `spreadsheetId` only (trap 4) | Spreadsheet (projection) |
| `copy_sheet` | `spreadsheets.sheets.copyTo` | `sheetId: int`, `destinationSpreadsheetId` | SheetProperties (projection) |
| `get_values` | `spreadsheets.values.get` | range req; majorDimension?, valueRenderOption?, dateTimeRenderOption? | ValueRange |
| `update_values` | `spreadsheets.values.update` | valueInputOption req; includeValuesInResponse?, response render opts | UpdateValuesResponse |
| `append_values` | `spreadsheets.values.append` | valueInputOption req; insertDataOption?; trap 7 | { spreadsheetId, tableRange?, updates } |
| `clear_values` ⚠ | `spreadsheets.values.clear` | range req; empty body | { spreadsheetId, clearedRange } |
| `batch_get_values` | `spreadsheets.values.batchGet` | ranges: string[] | { spreadsheetId, valueRanges } |
| `batch_update_values` | `spreadsheets.values.batchUpdate` | data: ValueRange[]; valueInputOption req | BatchUpdateValuesResponse |
| `batch_clear_values` ⚠ | `spreadsheets.values.batchClear` | ranges: string[] | { spreadsheetId, clearedRanges } |
| `batch_get_values_by_data_filter` | `values.batchGetByDataFilter` | dataFilters: DataFilter[] | { spreadsheetId, valueRanges: MatchedValueRange[] } |
| `batch_update_values_by_data_filter` | `values.batchUpdateByDataFilter` | data: DataFilterValueRange[]; valueInputOption req | BatchUpdateValuesByDataFilter response |
| `batch_clear_values_by_data_filter` ⚠ | `values.batchClearByDataFilter` | dataFilters | { spreadsheetId, clearedRanges } |
| `get_developer_metadata` | `developerMetadata.get` | metadataId: int | DeveloperMetadata |
| `search_developer_metadata` | `developerMetadata.search` | dataFilters | { matchedDeveloperMetadata } |

⚠ = `destructive: true`.

**Not exposed** (each with a reason in COVERAGE.md): `spreadsheets.batchUpdate`
(issue #27), `spreadsheets.getByDataFilter` (issue #28).

## Entities

Shared nouns, one file each, fields verbatim from the discovery document,
docs in `.describe()`: `CellValue`, `ValueRange`, `Spreadsheet`,
`SpreadsheetProperties`, `SheetProperties`, `GridProperties`,
`UpdateValuesResponse`, `DataFilter`, `GridRange`, `DimensionRange`,
`DeveloperMetadata`, `DeveloperMetadataLocation`, `DeveloperMetadataLookup`,
`MatchedValueRange`, `DataFilterValueRange`. One-off response wrappers stay
inline in their `schema.ts`.

`lib/` projections (each unit-tested): `spreadsheet.ts`
(`projectSpreadsheet`, `projectSheetProperties`), `values.ts`
(`projectValueRange`, `projectUpdateValuesResponse`), `metadata.ts`
(`projectDeveloperMetadata`).

## File trees

Before (src/, services only):

```
src/
  auth/  lib/  doctor/
  gmail/     # canary
  calendar/  # first replication
```

After:

```
src/
  auth/  lib/  doctor/   # doctor: sheets implemented + probe
  gmail/
  calendar/
  sheets/
    index.ts  operation.ts  capabilities.ts  operations.test.ts
    COVERAGE.md  README.md  CAPABILITIES.md
    entities/   # the 15 nouns above
    lib/        # spreadsheet.ts, values.ts, metadata.ts (+tests)
    methods/
      registry.ts
      create_spreadsheet/ get_spreadsheet/ copy_sheet/
      get_values/ update_values/ append_values/ clear_values/
      batch_get_values/ batch_update_values/ batch_clear_values/
      batch_get_values_by_data_filter/
      batch_update_values_by_data_filter/
      batch_clear_values_by_data_filter/
      get_developer_metadata/ search_developer_metadata/
```

## Commit sequence (gate: `bun run check` green at every step)

1. `docs(sheets): add the sheets service plan` — this file.
2. `feat(sheets): scaffold the sheets service skeleton` — `operation.ts`
   (`sheetsOperation` bound to `sheets_v4.Sheets`), empty
   `methods/registry.ts`, `index.ts` bootstrap, `capabilities.ts`,
   `operations.test.ts` (0 methods), `@googleapis/sheets` dep,
   `google-mcp-sheets` bin, root `capabilities` script gains sheets.
   Extra gate: built bin serves; `tools/list` returns 0.
3. `feat(sheets): add the spreadsheet and values read path` —
   `get_spreadsheet`, `get_values`, `batch_get_values`; entities
   `Spreadsheet`, `SpreadsheetProperties`, `SheetProperties`,
   `GridProperties`, `ValueRange`, `CellValue`; `lib/spreadsheet.ts`,
   `lib/values.ts`.
4. `feat(sheets): add the spreadsheet and values write path` —
   `create_spreadsheet`, `update_values`, `append_values`, `clear_values`;
   `UpdateValuesResponse`.
5. `feat(sheets): add the batch values operations` — `batch_update_values`,
   `batch_clear_values`.
6. `feat(sheets): add the data-filter values operations` — the three
   `*_by_data_filter` methods; entities `DataFilter`, `GridRange`,
   `DimensionRange`, `DeveloperMetadataLookup`, `DeveloperMetadataLocation`,
   `MatchedValueRange`, `DataFilterValueRange`.
7. `feat(sheets): add the developer metadata operations` —
   `get_developer_metadata`, `search_developer_metadata`,
   `DeveloperMetadata`; `lib/metadata.ts`.
8. `feat(sheets): add the sheet copy operation` — `copy_sheet`.
9. `feat(doctor): register sheets as implemented with a live probe` —
   flip `implemented: true`, sample-sheet probe (trap 6), probe covered in
   `services.probe.test.ts` by mocking `@googleapis/sheets`. Extra gate:
   `bun run doctor` live-green per account.
10. `docs(sheets): document the shipped service` — COVERAGE.md, service
    README, root README (table row, icon brightened, quickstart block,
    hero caption), AGENTS.md tree, package.json description + keywords,
    stale-parenthetical sweep. Extra gate: `bun run capabilities` no diff.
11. `docs(sheets): delete the shipped plan` — remove this file.

Surface-count test pins 0 tools / N methods and the exact destructive set,
updated in the same commit as each registry change.

## Verification checklist

- [ ] `bun run check` green (lint, build, typecheck, 100% coverage, knip)
- [ ] `bun run doctor` live-green for sheets on all three accounts
- [ ] Live pairwise pass over stdio (`dist/sheets/index.js`,
      `GOOGLE_MCP_ACCOUNT`) for every operation; disposable spreadsheet
      created first, Drive-trashed last; accounts end as found
- [ ] Operational matrix issue opened (rubric from #7/#22): live + unit
      checkbox per operation, proof line per live tick, findings recorded
- [ ] Docs shipped per commit 10; `bun run capabilities` produces no diff
- [ ] Plan file deleted (commit 11)
