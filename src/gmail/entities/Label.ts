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
 * (`id` -> `labelId`). Field docs use `.describe()` so they reach the wire JSON
 * Schema an MCP client reads.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Label = z.object({
  labelId: z.string().describe('The unique identifier of the label.'),
  name: z.string().describe('The human-readable display name of the label.'),
  color: LabelColor.optional().describe('Optional. The color of the label.'),
  threadsTotal: z.number().optional().describe('The total number of threads under the label.'),
  threadsUnread: z.number().optional().describe('The number of unread threads under the label.'),
});

export type Label = z.infer<typeof Label>;
