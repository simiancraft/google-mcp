import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get
 * Fetches a single message and projects it. MINIMAL maps to `metadata`,
 * FULL_CONTENT (default) maps to `full` (decoded body + attachment ids).
 */
export const get_message = defineMethod({
  description: 'Get a single message by id.',
  input,
  output,
  handler: async (gmail, args) => {
    const format = args.messageFormat === 'MINIMAL' ? 'metadata' : 'full';
    const { data } = await gmail.users.messages.get({ userId: 'me', id: args.messageId, format });
    return projectMessage(data);
  },
});
