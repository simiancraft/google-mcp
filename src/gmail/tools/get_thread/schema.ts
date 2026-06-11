import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

export const schema = {
  input: z.object({
    threadId: z.string(),
    messageFormat: z.enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT']).optional(),
  }),
  output: Thread,
};
