import { z } from 'zod';
import { Reply } from '../../entities/Reply.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    replyId: z.string().describe('The ID of the reply.'),
    content: z.string().describe('The plain text content to set on the reply.'),
  }),
  output: Reply,
};
