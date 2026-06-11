import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    revisionId: z.string().describe('The ID of the revision to permanently delete.'),
  }),
  /** Delete returns no body; we confirm the ids. */
  output: z.object({
    fileId: z.string().describe('The ID of the file.'),
    revisionId: z.string().describe('The ID of the permanently deleted revision.'),
  }),
};
