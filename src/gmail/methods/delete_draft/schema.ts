import { z } from 'zod';

export const schema = {
  input: z.object({
    draftId: z.string().describe('The id of the draft to delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    draftId: z.string(),
  }),
};
