import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

export const schema = {
  input: z.object({
    threadId: z.string().describe('The id of the thread to retrieve.'),
    messageFormat: z
      .enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT'])
      .optional()
      .describe(
        'MINIMAL returns headers and snippet only; FULL_CONTENT (the default) adds bodies and attachment ids.',
      ),
  }),
  output: Thread,
};
