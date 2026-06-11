import { z } from 'zod';
import { Reply } from '../../entities/Reply.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment.'),
    content: z
      .string()
      .optional()
      .describe('The plain text content of the reply. Required if no action value is specified.'),
    action: z
      .enum(['resolve', 'reopen'])
      .optional()
      .describe('The action the reply performs on the parent comment: resolve or reopen.'),
  }),
  output: Reply,
};
