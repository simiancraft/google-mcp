import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteHeaderRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). A removal, so destructive (the header's content goes
 * with it), but identity-addressed by headerId and therefore idempotent per
 * the unlabel precedent.
 */
export const delete_header = docsOperation({
  description:
    "Delete a header and its content by headerId. A document-wide header is removed from the first section; a section header is removed and that section continues the previous section's header.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteHeaderRequest',
  schema,
  handler,
});
