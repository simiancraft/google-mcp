import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertTableColumnRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Additive but not idempotent: repeating the
 * insert adds another column each time.
 */
export const insert_table_column = docsOperation({
  description:
    'Insert an empty column into a table, to the left or right of the column of a reference cell. Re-read the document afterwards: the insertion shifts indices throughout the table.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertTableColumnRequest',
  schema,
  handler,
});
