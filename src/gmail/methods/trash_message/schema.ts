import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash */
export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to move to the trash.'),
  }),
  output: Message,
};
