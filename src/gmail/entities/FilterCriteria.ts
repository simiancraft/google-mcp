import { z } from 'zod';

/** Matching criteria for a filter: which incoming messages it applies to. */
export const FilterCriteria = z.strictObject({
  from: z.string().optional().describe('Sender address the message must be from.'),
  to: z.string().optional().describe('Recipient address the message must be to.'),
  subject: z.string().optional().describe('Subject the message must contain.'),
  query: z.string().optional().describe('A Gmail query the message must match.'),
  negatedQuery: z.string().optional().describe('A Gmail query the message must NOT match.'),
  hasAttachment: z.boolean().optional().describe('Whether the message must have an attachment.'),
  excludeChats: z.boolean().optional().describe('Whether to exclude chats.'),
  size: z.number().int().optional().describe('Size in bytes the message is compared against.'),
  sizeComparison: z.enum(['smaller', 'larger']).optional().describe('How `size` is compared.'),
});

export type FilterCriteria = z.infer<typeof FilterCriteria>;
