import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/update
 * Replaces the draft's content with a freshly assembled message, then re-fetches
 * it `full` for projection.
 */
export const update_draft = gmailOperation({
  description: 'Replace the content of an existing draft.',
  schema,
  handler,
});
