import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to remove from the trash.'),
  }),
  output: Message,
};
