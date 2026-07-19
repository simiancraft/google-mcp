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
  'Ranges use A1 notation (or R1C1); cell data moves as 2D arrays of string, ' +
  'number, boolean, or null values; the values field is absent entirely for ' +
  'an empty range, and rows may be ragged. Every value write requires ' +
  'valueInputOption: RAW stores text as-is; USER_ENTERED parses values as if ' +
  'typed, so a leading = becomes a live formula; write untrusted content ' +
  'with RAW; condition values in rules are likewise parsed as typed, so a ' +
  'value starting with = or + becomes a live formula (ONE_OF_LIST list ' +
  'items excepted). append_values ' +
  'searches its range for a table and appends after ' +
  "it. The spreadsheet projection carries metadata plus each sheet's " +
  'protected ranges, conditional format rules, and merged ranges (never ' +
  'grid data), and the ' +
  "no delete; removing a spreadsheet is Drive's files.delete. Structural " +
  'edits (tabs, rows and columns, named ranges, formats, borders, charts, ' +
  'conditional format rules, data validation, protected ranges, cell ' +
  'content, merges) are ' +
  'purpose-named operations wrapping one batchUpdate request each. ' +
  "update_cells writes the union of the provided cells' fields to every " +
  'written cell, so a written field a cell omits is cleared in that cell. ' +
  'The ' +
  'property and format updates derive their masks from the fields provided, ' +
  'so untouched properties are never reset; update_chart_spec and ' +
  'update_conditional_format_rule are the exceptions, replacing the whole ' +
  'spec or rule, so send the complete object. Conditional format rules have ' +
  'no ID: they are addressed by sheet and index (their position in ' +
  "get_spreadsheet's conditionalFormats list), and adds, moves, and " +
  'deletes renumber the rules around them.';
