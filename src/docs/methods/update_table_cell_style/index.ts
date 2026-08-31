import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateTableCellStyleRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Only the provided style fields change;
 * re-applying the same arguments yields the same styling, so the operation
 * is idempotent.
 */
export const update_table_cell_style = docsOperation({
  description:
    'Set cell styling (background color, borders, padding, content alignment) on a rectangular range of table cells, or on the whole table when a table start location is given instead; only the provided fields change, and border updates also update the shared border of adjacent cells.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTableCellStyleRequest',
  schema,
  handler,
});
