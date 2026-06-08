import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/delete */
export const schema = {
  input: z.object({
    labelId: z.string().describe('The id of the user label to delete.'),
  }),
  /** Delete returns no body; we confirm the id. Removes the label from all messages/threads. */
  output: z.object({
    labelId: z.string(),
  }),
};
