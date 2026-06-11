import { z } from 'zod';

export const schema = {
  input: z.object({
    threadId: z.string().describe('The id of the thread to remove the labels from.'),
    labelIds: z.array(z.string()).describe('The ids of the labels to remove.'),
  }),
  /** The MCP reference documents no output body; we confirm the removed labels. */
  output: z.object({
    threadId: z.string(),
    labelIds: z.array(z.string()),
  }),
};
