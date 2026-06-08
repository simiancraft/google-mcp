import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/delete
 *
 * Irreversible: permanently deletes a thread and all its messages (bypasses the
 * trash; cannot be undone). Prefer trash_thread unless permanence is intended.
 */
export const delete_thread = operation({
  description: 'Permanently delete a thread and all its messages (bypasses the trash).',
  destructive: true,
  schema,
  handler,
});
