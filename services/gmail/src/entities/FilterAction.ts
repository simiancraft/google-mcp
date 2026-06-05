import { z } from 'zod';

/** What a filter does to a message that matches its criteria. */
export const FilterAction = z.object({
  /** Label ids to add to matching messages. */
  addLabelIds: z.array(z.string()).optional(),
  /** Label ids to remove from matching messages. */
  removeLabelIds: z.array(z.string()).optional(),
  /** A verified forwarding address to forward matching messages to. */
  forward: z.string().optional(),
});

export type FilterAction = z.infer<typeof FilterAction>;
