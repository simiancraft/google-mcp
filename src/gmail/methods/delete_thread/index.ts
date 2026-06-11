import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/delete
 *
 * Irreversible: permanently deletes a thread and all its messages (bypasses the
 * trash; cannot be undone). Prefer trash_thread unless permanence is intended.
 */
export const delete_thread = gmailOperation({
  description: 'Permanently delete a thread and all its messages (bypasses the trash).',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  schema,
  handler,
});
