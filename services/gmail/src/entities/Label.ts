import { z } from 'zod';
import { LabelColor } from './LabelColor.js';

/** Source: object (Label) on the Gmail MCP reference. A Gmail label. */
export const Label = z.object({
  /** The unique identifier of the label. */
  labelId: z.string(),
  /** The human-readable display name of the label. */
  name: z.string(),
  /** Optional. The color of the label. */
  color: LabelColor.optional(),
  /** The total number of threads under the label. */
  threadsTotal: z.number().optional(),
  /** The number of unread threads under the label. */
  threadsUnread: z.number().optional(),
});

export type Label = z.infer<typeof Label>;
