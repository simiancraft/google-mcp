import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchDelete
 *
 * Irreversible: permanently deletes many messages at once (bypasses the trash;
 * cannot be undone). Requires the full https://mail.google.com/ scope.
 */
export const batch_delete_messages = operation({
  description: 'Permanently delete many messages at once (bypasses the trash).',
  destructive: true,
  schema,
  handler,
});
