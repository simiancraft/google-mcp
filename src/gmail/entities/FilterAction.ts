import { z } from 'zod';

/** What a filter does to a message that matches its criteria. */
export const FilterAction = z.strictObject({
  addLabelIds: z.array(z.string()).optional().describe('Label ids to add to matching messages.'),
  removeLabelIds: z
    .array(z.string())
    .optional()
    .describe('Label ids to remove from matching messages.'),
  forward: z
    .email()
    .optional()
    .describe('A verified forwarding address to forward matching messages to.'),
});

export type FilterAction = z.infer<typeof FilterAction>;
