import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages.attachments/get
 * Returns the attachment bytes base64url-encoded, as Gmail returns them.
 */
export const download_attachment = defineMethod({
  description: 'Download a message attachment (base64url-encoded bytes).',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: args.messageId,
      id: args.attachmentId,
    });
    return {
      attachmentId: args.attachmentId,
      size: data.size ?? 0,
      data: data.data ?? '',
    };
  },
});
