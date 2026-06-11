import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/delete
 *
 * Irreversible: permanently deletes a message (bypasses the trash; cannot be
 * undone). Prefer trash_message unless permanence is intended.
 */
export const delete_message = gmailOperation({
  description: 'Permanently delete a message (bypasses the trash).',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
