import { z } from 'zod';
import { User } from './User.js';

/**
 * A reply to a comment on a file. A reply may carry an `action` that resolves
 * or reopens its parent comment.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/manage-comments
 */
export const Reply = z.object({
  id: z.string().describe('Output only. The ID of the reply.'),
  content: z
    .string()
    .optional()
    .describe(
      'The plain text content of the reply. This field is used for setting the content, ' +
        'while htmlContent should be displayed.',
    ),
  htmlContent: z
    .string()
    .optional()
    .describe('Output only. The content of the reply with HTML formatting.'),
  author: User.optional().describe(
    "Output only. The author of the reply. The author's email address and permission ID won't be populated.",
  ),
  createdTime: z
    .string()
    .optional()
    .describe('The time at which the reply was created (RFC 3339 date-time).'),
  modifiedTime: z
    .string()
    .optional()
    .describe('The last time the reply was modified (RFC 3339 date-time).'),
  deleted: z
    .boolean()
    .optional()
    .describe('Output only. Whether the reply has been deleted. A deleted reply has no content.'),
  action: z
    .enum(['resolve', 'reopen'])
    .optional()
    .describe(
      'The action the reply performed to the parent comment. The supported values are: ' +
        'resolve, reopen.',
    ),
});

export type Reply = z.infer<typeof Reply>;
