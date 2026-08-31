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
  vocabularyInstructions({ restOnly: 'Docs' }) +
  untrustedContentInstructions() +
  'get_document returns the body as text blocks with zero-based UTF-16 index ' +
  'ranges; those ranges are what insert_text and delete_content_range ' +
  'target, and they shift on every edit, so re-read the document before ' +
  'computing new ranges. Non-text elements appear as U+FFFC placeholders, one ' +
  'per UTF-16 unit, so block text length always equals its index span; an ' +
  'emoji is two units, and ranges must not split a surrogate pair. ' +
  'insert_text with no index appends at the end of the ' +
  'body, and body content starts at index 1. Ranges, locations, and ' +
  'insert_text take an optional segmentId (a headerId, footerId, or ' +
  'footnoteId from get_document) addressing that segment instead of the ' +
  'body; segment content starts at index 0, not 1. replace_all_text and ' +
  'delete_content_range destroy the matched or ranged text irreversibly. ' +
  'The style updates (update_text_style, update_paragraph_style, ' +
  'update_document_style, update_section_style, and the table styling ' +
  'operations) change only the style fields ' +
  'you provide, and point-valued fields take plain numbers of points. ' +
  "A table element carries its cell tree (tableRows of cells, each cell's " +
  'content holding the same text blocks), so target text inside a cell by ' +
  'the paragraph indices within it, a table by its start index, and a cell ' +
  'by table start plus zero-based row and column. delete_table_row and ' +
  'delete_table_column remove all content the row or column holds. ' +
  'delete_paragraph_bullets preserves the text; ' +
  'create_paragraph_bullets consumes leading tabs to set nesting, so indices ' +
  'can shift on first application. ' +
  "The Docs API has no delete or list; removing a document is Drive's " +
  'files.delete, and document creation takes only a title.';
