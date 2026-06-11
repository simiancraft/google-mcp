import { z } from 'zod';
import { Reply } from './Reply.js';
import { User } from './User.js';

/**
 * A comment on a file: anchored or unanchored feedback with a reply thread.
 * Comments are set as plain text (`content`) and displayed from
 * `htmlContent`; a comment is resolved by one of its replies.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/manage-comments
 */
export const Comment = z.object({
  id: z.string().describe('Output only. The ID of the comment.'),
  content: z
    .string()
    .optional()
    .describe(
      'The plain text content of the comment. This field is used for setting the content, ' +
        'while htmlContent should be displayed.',
    ),
  htmlContent: z
    .string()
    .optional()
    .describe('Output only. The content of the comment with HTML formatting.'),
  author: User.optional().describe(
    "Output only. The author of the comment. The author's email address and permission ID will not be populated.",
  ),
  createdTime: z
    .string()
    .optional()
    .describe('The time at which the comment was created (RFC 3339 date-time).'),
  modifiedTime: z
    .string()
    .optional()
    .describe('The last time the comment or any of its replies was modified (RFC 3339 date-time).'),
  resolved: z
    .boolean()
    .optional()
    .describe('Output only. Whether the comment has been resolved by one of its replies.'),
  deleted: z
    .boolean()
    .optional()
    .describe(
      'Output only. Whether the comment has been deleted. A deleted comment has no content.',
    ),
  anchor: z.string().optional().describe('A region of the document represented as a JSON string.'),
  quotedFileContent: z
    .object({
      mimeType: z.string().optional().describe('The MIME type of the quoted content.'),
      value: z.string().optional().describe('The quoted content itself.'),
    })
    .optional()
    .describe(
      'The file content to which the comment refers, typically within the anchor region. ' +
        'For a text file, for example, this would be the text at the location of the comment.',
    ),
  replies: z
    .array(Reply)
    .optional()
    .describe('Output only. The full list of replies to the comment in chronological order.'),
});

export type Comment = z.infer<typeof Comment>;
