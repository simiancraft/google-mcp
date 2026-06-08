import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/delete */
export const schema = {
  input: z.object({
    filterId: z.string().describe('The id of the filter to delete.'),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    filterId: z.string(),
  }),
};
