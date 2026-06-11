import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Replaces the draft's content with a freshly assembled message, then re-fetches
 * it `full` for projection.
 */
export const update_draft = gmailOperation({
  description: 'Replace the content of an existing draft.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/update',
  schema,
  handler,
});
