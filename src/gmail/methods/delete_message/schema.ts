import { z } from 'zod';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to permanently delete.'),
  }),
  output: z.object({
    messageId: z.string(),
  }),
};
