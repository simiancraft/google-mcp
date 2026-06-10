import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/delete
 * Deletes a draft. Not marked destructive: a draft is unsent and recreatable.
 */
export const delete_draft = gmailOperation({
  description: 'Delete a draft.',
  schema,
  handler,
});
