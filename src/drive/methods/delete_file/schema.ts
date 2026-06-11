import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file to permanently delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    fileId: z.string().describe('The ID of the permanently deleted file.'),
  }),
};
