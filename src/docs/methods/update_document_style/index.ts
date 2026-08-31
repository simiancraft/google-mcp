import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateDocumentStyleRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Only the provided fields change; re-applying
 * the same arguments yields the same document style, so the operation is
 * idempotent.
 */
export const update_document_style = docsOperation({
  description:
    'Set document-wide styling (page margins, header and footer margins, page size and orientation, page number start, first- and even-page header toggles, background color); only the provided fields change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateDocumentStyleRequest',
  schema,
  handler,
});
