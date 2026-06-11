import { z } from 'zod';
import { Reply } from '../../entities/Reply.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    includeDeleted: z
      .boolean()
      .optional()
      .describe(
        "Whether to include deleted replies. Deleted replies don't include their original content.",
      ),
    pageSize: z
      .number()
      .int()
      .optional()
      .describe('The maximum number of replies to return per page.'),
    pageToken: z
      .string()
      .optional()
      .describe(
        'The token for continuing a previous list request on the next page. This should be set ' +
          'to the value of nextPageToken from the previous response.',
      ),
  }),
  output: z.object({
    replies: z.array(Reply).describe('The list of replies.'),
    nextPageToken: z
      .string()
      .optional()
      .describe(
        'The page token for the next page of replies. This will be absent if the end of the ' +
          'replies list has been reached.',
      ),
  }),
};
