import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message to add the labels to.'),
    labelIds: z.array(z.string()).describe('The ids of the labels to add.'),
  }),
  /** The MCP reference documents no output body; we confirm the applied labels. */
  output: z.object({
    messageId: z.string().describe('The message the labels were applied to.'),
    labelIds: z.array(z.string()).describe('The label ids confirmed applied.'),
  }),
};
