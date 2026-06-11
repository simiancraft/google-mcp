import { z } from 'zod';
import { Comment } from '../../entities/Comment.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    includeDeleted: z
      .boolean()
      .optional()
      .describe(
        'Whether to return deleted comments. Deleted comments will not include their original content.',
      ),
  }),
  output: Comment,
};
