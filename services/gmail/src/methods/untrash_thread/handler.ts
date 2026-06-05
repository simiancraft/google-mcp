import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/untrash
 * Reversible: removes every message in a thread from the trash.
 */
export const untrash_thread = defineMethod({
  description: 'Remove a thread from the trash.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.threads.untrash({ userId: 'me', id: args.threadId });
    return { id: data.id ?? args.threadId, messages: (data.messages ?? []).map(projectMessage) };
  },
});
