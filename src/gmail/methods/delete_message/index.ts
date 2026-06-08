import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/delete
 *
 * Irreversible: permanently deletes a message (bypasses the trash; cannot be
 * undone). Prefer trash_message unless permanence is intended.
 */
export const delete_message = operation({
  description: 'Permanently delete a message (bypasses the trash).',
  destructive: true,
  schema,
  handler,
});
