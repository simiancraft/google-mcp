import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/delete
 *
 * Irreversible: permanently deletes a thread and all its messages (bypasses the
 * trash; cannot be undone). Prefer trash_thread unless permanence is intended.
 */
export const delete_thread = defineMethod({
  description: 'Permanently delete a thread and all its messages (bypasses the trash).',
  destructive: true,
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.threads.delete({ userId: 'me', id: args.threadId });
    return { threadId: args.threadId };
  },
});
