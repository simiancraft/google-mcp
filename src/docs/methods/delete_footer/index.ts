import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteFooterRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). A removal, so destructive (the footer's content goes
 * with it), but identity-addressed by footerId and therefore idempotent per
 * the unlabel precedent.
 */
export const delete_footer = docsOperation({
  description:
    "Delete a footer and its content by footerId. A document-wide footer is removed from the first section; a section footer is removed and that section continues the previous section's footer.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteFooterRequest',
  schema,
  handler,
});
