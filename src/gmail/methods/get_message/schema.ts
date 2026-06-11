import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to retrieve.'),
    messageFormat: z
      .enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT'])
      .optional()
      .describe(
        'MINIMAL returns headers and snippet only; FULL_CONTENT (the default) adds bodies and attachment ids.',
      ),
  }),
  output: Message,
};
