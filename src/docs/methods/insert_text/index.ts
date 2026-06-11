import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** One InsertTextRequest applied via `documents.batchUpdate` (the curated subset; issue #35). */
export const insert_text = docsOperation({
  description:
    'Insert text into a document body, at a UTF-16 index or (omitted) appended at the end.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertTextRequest',
  schema,
  handler,
});
