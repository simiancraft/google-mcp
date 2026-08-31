import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertTableRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Additive but not idempotent: repeating the insert adds
 * another table (and its preceding newline) each time.
 */
export const insert_table = docsOperation({
  description:
    'Insert an empty table with the given number of rows and columns; a newline character is inserted before the table, so the table starts one index past the insertion point. Re-read the document afterwards to target the new cells.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertTableRequest',
  schema,
  handler,
});
