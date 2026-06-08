import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/untrash
 * Reversible: removes a message from the trash.
 */
export const untrash_message = defineMethod({
  description: 'Remove a message from the trash.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.messages.untrash({ userId: 'me', id: args.messageId });
    return projectMessage(data);
  },
});
