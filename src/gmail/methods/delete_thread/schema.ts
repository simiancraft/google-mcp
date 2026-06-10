import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/delete */
export const schema = {
  input: z.object({
    threadId: z.string().describe('The id of the thread to permanently delete.'),
  }),
  /** Delete returns no body; we confirm the id. Prefer trash_thread unless permanence is intended. */
  output: z.object({
    threadId: z.string(),
  }),
};
