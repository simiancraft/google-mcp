import { z } from 'zod';
import { LabelColor } from './LabelColor.js';

/**
 * A mechanism for organizing messages and threads (for example, a "taxes" label
 * applied to all tax-related messages).
 *
 * Two types: **system labels** (INBOX, TRASH, SPAM, ...) are internally created
 * and cannot be deleted or modified, though some (like INBOX) can be applied to
 * or removed from messages and threads; **user labels** are created by a user or
 * application and can be modified or deleted.
 *
 * Fields here are the MCP-projected shape of the REST `labels` resource
 * (`id` -> `labelId`).
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
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
