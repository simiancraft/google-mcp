import { z } from 'zod';
import { Comment } from '../../entities/Comment.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    content: z.string().describe('The plain text content of the comment.'),
    anchor: z
      .string()
      .optional()
      .describe(
        'A region of the document represented as a JSON string; omit for an unanchored comment.',
      ),
  }),
  output: Comment,
};
