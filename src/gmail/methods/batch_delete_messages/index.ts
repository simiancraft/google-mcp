import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Irreversible: permanently deletes many messages at once (bypasses the trash;
 * cannot be undone). Requires the full https://mail.google.com/ scope.
 */
export const batch_delete_messages = gmailOperation({
  description: 'Permanently delete many messages at once (bypasses the trash).',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchDelete',
  schema,
  handler,
});
