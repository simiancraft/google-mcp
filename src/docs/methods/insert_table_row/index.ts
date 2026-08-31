import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertTableRowRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Additive but not idempotent: repeating the insert adds
 * another row each time.
 */
export const insert_table_row = docsOperation({
  description:
    'Insert an empty row into a table, above or below the row of a reference cell. Re-read the document afterwards: the insertion shifts every index at or after the new row.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertTableRowRequest',
  schema,
  handler,
});
