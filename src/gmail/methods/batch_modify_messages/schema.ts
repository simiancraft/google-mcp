import { z } from 'zod';

export const schema = {
  input: z.object({
    messageIds: z.array(z.string()).describe('The ids of the messages to modify.'),
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
  }),
  output: z.object({
    messageIds: z.array(z.string()),
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
  }),
};
