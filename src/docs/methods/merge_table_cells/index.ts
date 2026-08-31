import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One MergeTableCellsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Destructive: the merged cells' text is
 * concatenated into the head cell, a non-additive rearrangement the API
 * cannot undo. Idempotent: re-merging the same range has no additional
 * effect.
 */
export const merge_table_cells = docsOperation({
  description:
    "Merge a rectangular range of table cells into one; any text in the merged cells is concatenated into the range's head cell (upper-left in left-to-right content). A non-rectangular range is rejected with a 400 error.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#MergeTableCellsRequest',
  schema,
  handler,
});
