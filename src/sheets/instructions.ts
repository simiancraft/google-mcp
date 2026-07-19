/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import {
  identityInstructions,
  untrustedContentInstructions,
  vocabularyInstructions,
} from '../lib/instructions.js';

export const instructions =
  identityInstructions('Google account') +
  vocabularyInstructions({ restOnly: 'Sheets' }) +
  untrustedContentInstructions() +
  'Ranges use A1 notation (or R1C1); cell values move as 2D arrays of string, ' +
  'number, boolean, or null values; the values field is absent entirely for ' +
  'an empty range, and rows may be ragged. Writes through the values ' +
  'operations require valueInputOption. RAW stores text as-is; USER_ENTERED parses values as if ' +
  'typed, so a leading = becomes a live formula; write untrusted content ' +
  'with RAW. update_cells types each value explicitly instead: a ' +
  'stringValue is never parsed and a formulaValue always executes. ' +
  'Condition values in rules are parsed as typed, so a ' +
  'value starting with = or + becomes a live formula (ONE_OF_LIST list ' +
  'items excepted). append_values ' +
  'searches its range for a table and appends after ' +
  'it. find_replace can rewrite formula source when includeFormulas is true, ' +
  'and formula-bearing copy/cut paste operations execute copied formulas at ' +
  "their destination. The spreadsheet projection carries metadata plus each sheet's " +
  'basic filter, filter views, protected ranges, conditional format rules, ' +
  'banded ranges, ordered row and column groups, and merged ranges (never ' +
  'grid data), and the Sheets API has ' +
  "no delete; removing a spreadsheet is Drive's files.delete. Structural " +
  'edits (tabs, rows and columns, exact dimension sizes and visibility, ' +
  'dimension groups, named ranges, formats, banding, borders, charts and ' +
  'their position, ' +
  'conditional format rules, data validation, protected ranges, cell ' +
  'content, merges, sorting, filters, and data transformations) are ' +
  'purpose-named operations wrapping one batchUpdate request each. ' +
  "update_cells writes the union of the provided cells' fields to every " +
  'written cell, so a written field a cell omits is cleared in that cell, ' +
  'and writing to an explicit range clears those fields in the part of the ' +
  'range the rows do not cover. ' +
  'The ' +
  'property, format, filter-view, banding, and embedded-object layout updates derive ' +
  'their masks from the fields provided, ' +
  'so untouched properties are never reset, except that a filter view is backed by either ' +
  'a range or named range and providing one backing detaches the other; update_chart_spec and ' +
  'update_conditional_format_rule are the exceptions, replacing the whole ' +
  'spec or rule, so send the complete object. Conditional format rules have ' +
  'no ID: they are addressed by sheet and index (their position in ' +
  "get_spreadsheet's conditionalFormats list), and adds, moves, and " +
  'deletes renumber the rules around them. Filter views instead have stable ' +
  'filterViewId identities listed by get_spreadsheet; the basic filter is a ' +
  'single sheet-level basicFilter. Banded-range readouts carry either a ' +
  'bandedRangeId or bandedRangeReference; only an ID can be passed to the ' +
  'banding update and delete operations. Row and column groups have no ID; ' +
  'update_dimension_group selects one by range plus depth, while add and ' +
  'delete take a range. Collapsing or expanding a group also hides or reveals ' +
  'every dimension inside it.';
