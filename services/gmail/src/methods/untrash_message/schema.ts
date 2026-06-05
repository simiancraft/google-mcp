import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/untrash */
export const input = z.object({
  messageId: z.string().describe('The id of the message to remove from the trash.'),
});

export const output = Message;
