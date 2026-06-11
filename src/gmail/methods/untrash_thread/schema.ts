import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

export const schema = {
  input: z.strictObject({
    threadId: z.string().describe('The id of the thread to remove from the trash.'),
  }),
  output: Thread,
};
