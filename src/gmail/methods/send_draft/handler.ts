import { defineMethod } from '../../defineMethod.js';
import { projectMessage } from '../../lib/message.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/send
 *
 * Irreversible: sends an existing draft, which deletes the draft and creates a
 * message with the SENT label. Returns the sent message.
 */
export const send_draft = defineMethod({
  description: 'Send an existing draft.',
  destructive: true,
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.drafts.send({
      userId: 'me',
      requestBody: { id: args.draftId },
    });
    return projectMessage(data);
  },
});
