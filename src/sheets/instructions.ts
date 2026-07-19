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
  'with RAW. append_values searches its range for a table and appends after ' +
  'it. The spreadsheet projection is metadata-only, and the Sheets API has ' +
  "no delete; removing a spreadsheet is Drive's files.delete. Structural " +
  'edits (tabs, rows and columns, named ranges, formats, borders, charts) ' +
  'are purpose-named operations wrapping one batchUpdate request each. The ' +
  'property and format updates derive their masks from the fields provided, ' +
  'so untouched properties are never reset; update_chart_spec is the ' +
  'exception, replacing the whole spec, so send the complete chart.';
