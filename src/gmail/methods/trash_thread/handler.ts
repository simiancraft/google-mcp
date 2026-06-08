import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/trash
 * Reversible: moves every message in a thread to the trash (undo with untrash_thread).
 */
export const trash_thread = defineMethod({
  description: 'Move a thread to the trash.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.threads.trash({ userId: 'me', id: args.threadId });
    return { id: data.id ?? args.threadId, messages: (data.messages ?? []).map(projectMessage) };
  },
});
