import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

export const schema = {
  input: z.object({
    threadId: z.string().describe('The id of the thread to move to the trash.'),
  }),
  output: Thread,
};
