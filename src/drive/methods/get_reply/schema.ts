import { z } from 'zod';
import { Reply } from '../../entities/Reply.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    replyId: z.string().describe('The ID of the reply.'),
    includeDeleted: z
      .boolean()
      .optional()
      .describe(
        "Whether to return deleted replies. Deleted replies don't include their original content.",
      ),
  }),
  output: Reply,
};
