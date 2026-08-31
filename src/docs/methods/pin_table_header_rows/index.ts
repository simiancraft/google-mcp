import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One PinTableHeaderRowsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). An update: re-applying the same count has no
 * additional effect, so the operation is idempotent.
 */
export const pin_table_header_rows = docsOperation({
  description:
    'Pin the first N rows of a table as header rows that repeat on every page the table spans; a count of 0 unpins all rows.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#PinTableHeaderRowsRequest',
  schema,
  handler,
});
