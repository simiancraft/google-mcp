import { z } from 'zod';

/** Matching criteria for a filter: which incoming messages it applies to. */
export const FilterCriteria = z.object({
  /** Sender address the message must be from. */
  from: z.string().optional(),
  /** Recipient address the message must be to. */
  to: z.string().optional(),
  /** Subject the message must contain. */
  subject: z.string().optional(),
  /** A Gmail query the message must match. */
  query: z.string().optional(),
  /** A Gmail query the message must NOT match. */
  negatedQuery: z.string().optional(),
  /** Whether the message must have an attachment. */
  hasAttachment: z.boolean().optional(),
  /** Whether to exclude chats. */
  excludeChats: z.boolean().optional(),
  /** Size in bytes the message is compared against. */
  size: z.number().int().optional(),
  /** How `size` is compared. One of: unspecified, smaller, larger. */
  sizeComparison: z.string().optional(),
});

export type FilterCriteria = z.infer<typeof FilterCriteria>;
