import { z } from 'zod';

export const schema = {
  input: z.object({
    messageIds: z.array(z.string()).describe('The ids of the messages to modify.'),
    addLabelIds: z.array(z.string()).optional().describe('The ids of the labels to add.'),
    removeLabelIds: z.array(z.string()).optional().describe('The ids of the labels to remove.'),
  }),
  /** batchModify returns no body; we confirm the ids and the applied changes. */
  output: z.object({
    messageIds: z.array(z.string()).describe('The ids of the modified messages.'),
    addLabelIds: z.array(z.string()).optional().describe('The label ids confirmed added.'),
    removeLabelIds: z.array(z.string()).optional().describe('The label ids confirmed removed.'),
  }),
};
