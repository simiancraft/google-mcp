import { z } from 'zod';

export const schema = {
  input: z.object({
    threadId: z.string().describe('The id of the thread to add the labels to.'),
    labelIds: z.array(z.string()).describe('The ids of the labels to add.'),
  }),
  /** The MCP reference documents no output body; we confirm the applied labels. */
  output: z.object({
    threadId: z.string(),
    labelIds: z.array(z.string()),
  }),
};
