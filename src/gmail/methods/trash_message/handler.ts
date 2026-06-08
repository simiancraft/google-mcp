import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash
 * Reversible: moves a message to the trash (undo with untrash_message).
 */
export const trash_message = defineMethod({
  description: 'Move a message to the trash.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.messages.trash({ userId: 'me', id: args.messageId });
    return projectMessage(data);
  },
});
