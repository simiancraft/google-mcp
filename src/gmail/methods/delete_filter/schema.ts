import { z } from 'zod';

export const schema = {
  input: z.object({
    filterId: z.string().describe('The id of the filter to delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    filterId: z.string().describe('The id of the deleted filter.'),
  }),
};
