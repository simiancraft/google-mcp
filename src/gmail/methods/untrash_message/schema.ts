import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message to remove from the trash.'),
  }),
  output: Message,
};
