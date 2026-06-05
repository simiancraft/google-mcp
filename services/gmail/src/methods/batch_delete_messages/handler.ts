import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchDelete
 *
 * Irreversible: permanently deletes many messages at once (bypasses the trash;
 * cannot be undone). Requires the full https://mail.google.com/ scope.
 */
export const batch_delete_messages = defineMethod({
  description: 'Permanently delete many messages at once (bypasses the trash).',
  destructive: true,
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.messages.batchDelete({
      userId: 'me',
      requestBody: { ids: args.messageIds },
    });
    return { messageIds: args.messageIds };
  },
});
