import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteTableRowRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Destructive (the row's cells and their content are
 * gone; the API has no undo) and, like `delete_content_range`, not
 * idempotent: after the deletion the same cell location addresses a
 * different row, so repeating the call deletes successive rows.
 */
export const delete_table_row = docsOperation({
  description:
    'Delete the table row a reference cell spans, including all cell content; a merged cell spanning multiple rows deletes them all, and deleting the last row deletes the whole table.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteTableRowRequest',
  schema,
  handler,
});
