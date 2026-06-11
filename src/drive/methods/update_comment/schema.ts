import { z } from 'zod';
import { Comment } from '../../entities/Comment.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    content: z.string().describe('The plain text content to set on the comment.'),
  }),
  output: Comment,
};
