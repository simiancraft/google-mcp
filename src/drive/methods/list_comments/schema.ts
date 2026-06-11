import { z } from 'zod';
import { Comment } from '../../entities/Comment.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    includeDeleted: z
      .boolean()
      .optional()
      .describe(
        'Whether to include deleted comments. Deleted comments will not include their original content.',
      ),
    pageSize: z
      .number()
      .int()
      .optional()
      .describe('The maximum number of comments to return per page.'),
    pageToken: z
      .string()
      .optional()
      .describe(
        'The token for continuing a previous list request on the next page. This should be set ' +
          "to the value of 'nextPageToken' from the previous response.",
      ),
    startModifiedTime: z
      .string()
      .optional()
      .describe(
        "The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time).",
      ),
  }),
  output: z.object({
    comments: z.array(Comment).describe('The list of comments.'),
    nextPageToken: z
      .string()
      .optional()
      .describe(
        'The page token for the next page of comments. This will be absent if the end of the ' +
          'comments list has been reached.',
      ),
  }),
};
