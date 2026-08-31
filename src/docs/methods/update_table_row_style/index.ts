import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateTableRowStyleRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Only the provided style fields change;
 * re-applying the same arguments yields the same styling, so the operation
 * is idempotent.
 */
export const update_table_row_style = docsOperation({
  description:
    'Set row styling (minimum row height, header row, overflow prevention) on specific table rows, or on every row when no indices are given; only the provided fields change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTableRowStyleRequest',
  schema,
  handler,
});
