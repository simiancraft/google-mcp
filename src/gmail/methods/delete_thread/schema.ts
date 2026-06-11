import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    threadId: z.string().describe('The id of the thread to permanently delete.'),
  }),
  /** Delete returns no body; we confirm the id. Prefer trash_thread unless permanence is intended. */
  output: z.object({
    threadId: z.string().describe('The id of the permanently deleted thread.'),
  }),
};
