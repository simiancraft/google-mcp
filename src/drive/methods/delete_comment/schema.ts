import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the comment to delete.'),
  }),
  /** Delete returns no body; we confirm the ids. */
  output: z.object({
    fileId: z.string().describe('The ID of the file.'),
    commentId: z.string().describe('The ID of the deleted comment.'),
  }),
};
