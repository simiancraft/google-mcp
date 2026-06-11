import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message to move to the trash.'),
  }),
  output: Message,
};
