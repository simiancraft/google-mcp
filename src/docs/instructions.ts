/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import { SOURCE_META_KEY } from '../lib/operation.js';
import { identityInstructions } from '../lib/server.js';

export const instructions =
  identityInstructions('Google account') +
  'Google publishes no MCP toolset for Docs, so every operation transcribes ' +
  'the REST reference; each tools/list entry links its source page under ' +
  `_meta['${SOURCE_META_KEY}'] and carries the four MCP behavior hints. ` +
  'get_document returns the body as text blocks with zero-based UTF-16 index ' +
  'ranges; those ranges are what insert_text and delete_content_range ' +
  'target, and they shift on every edit, so re-read the document before ' +
  'computing new ranges. Non-text elements appear as U+FFFC placeholders, one ' +
  'per UTF-16 unit, so block text length always equals its index span; an ' +
  'emoji is two units, and ranges must not split a surrogate pair. ' +
  'insert_text with no index appends at the end of the ' +
  'body, and body content starts at index 1. replace_all_text and ' +
  'delete_content_range destroy the matched or ranged text irreversibly. ' +
  'update_text_style and update_paragraph_style change only the style fields ' +
  'you provide. delete_paragraph_bullets preserves the text; ' +
  'create_paragraph_bullets consumes leading tabs to set nesting, so indices ' +
  'can shift on first application. ' +
  "The Docs API has no delete or list; removing a document is Drive's " +
  'files.delete, and document creation takes only a title.';
