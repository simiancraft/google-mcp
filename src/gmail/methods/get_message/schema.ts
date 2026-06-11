import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.object({
    messageId: z.string(),
    messageFormat: z.enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT']).optional(),
  }),
  output: Message,
};
