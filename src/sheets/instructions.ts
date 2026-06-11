/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import { SOURCE_META_KEY } from '../lib/operation.js';
import { identityInstructions } from '../lib/server.js';

export const instructions =
  identityInstructions('Google account') +
  'Google publishes no MCP toolset for Sheets, so every operation transcribes ' +
  'the REST reference; each tools/list entry links its source page under ' +
  `_meta['${SOURCE_META_KEY}'] and carries the four MCP behavior hints. ` +
  'Ranges use A1 notation (or R1C1); cell data moves as 2D arrays of string, ' +
  'number, boolean, or null values; the values field is absent entirely for ' +
  'an empty range, and rows may be ragged. Every value write requires ' +
  'valueInputOption: RAW stores text as-is; USER_ENTERED parses values as if ' +
  'typed, so a leading = becomes a live formula; write untrusted content ' +
  'with RAW. append_values searches its range for a table and appends after ' +
  'it. The spreadsheet projection is metadata-only, and the Sheets API has ' +
  "no delete; removing a spreadsheet is Drive's files.delete.";
