import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/delete
 *
 * Irreversible: permanently deletes a message (bypasses the trash; cannot be
 * undone). Prefer trash_message unless permanence is intended.
 */
export const delete_message = defineMethod({
  description: 'Permanently delete a message (bypasses the trash).',
  destructive: true,
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.messages.delete({ userId: 'me', id: args.messageId });
    return { messageId: args.messageId };
  },
});
