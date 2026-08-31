import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UnmergeTableCellsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). A removal of merge structure (the unlabel
 * precedent: destructive, though the text itself is preserved in the head
 * cell), and idempotent by the API's own contract: cells that are already
 * unmerged are not affected, and a range with no merged cells does nothing.
 */
export const unmerge_table_cells = docsOperation({
  description:
    'Unmerge all merged cells in a range of table cells; text in a merged cell remains in the head cell of the resulting block of unmerged cells, and a range with no merged cells does nothing.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UnmergeTableCellsRequest',
  schema,
  handler,
});
