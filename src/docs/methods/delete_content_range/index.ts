import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteContentRangeRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Destructive and not idempotent: indices shift
 * after every edit, so repeating the same range deletes different content.
 * Deleting across a paragraph boundary merges the paragraphs.
 */
export const delete_content_range = docsOperation({
  description:
    'Delete a UTF-16 index range of document content, irreversibly; indices shift afterward, so re-read before further edits.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteContentRangeRequest',
  schema,
  handler,
});
