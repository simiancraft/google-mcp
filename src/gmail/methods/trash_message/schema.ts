import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to move to the trash.'),
  }),
  output: Message,
};
