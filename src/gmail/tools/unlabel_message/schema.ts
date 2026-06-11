import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message to remove the labels from.'),
    labelIds: z.array(z.string()).describe('The ids of the labels to remove.'),
  }),
  /** The MCP reference documents no output body; we confirm the removed labels. */
  output: z.object({
    messageId: z.string().describe('The message the labels were removed from.'),
    labelIds: z.array(z.string()).describe('The label ids confirmed removed.'),
  }),
};
