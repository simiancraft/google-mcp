import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateFootnoteRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Additive but not idempotent: repeating the create
 * inserts another footnote reference and segment each time. Body-only by
 * the API's contract, so no segmentId is exposed on the reference location.
 */
export const create_footnote = docsOperation({
  description:
    "Create a footnote: inserts a footnote reference into the body and returns the new footnote segment's footnoteId — pass that as segmentId to insert_text to write the footnote text (footnote content starts at index 0).",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateFootnoteRequest',
  schema,
  handler,
});
