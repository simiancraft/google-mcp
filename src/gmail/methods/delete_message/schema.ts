import { z } from 'zod';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to permanently delete.'),
  }),
  /** Delete returns no body; we confirm the id. Prefer trash_message unless permanence is intended. */
  output: z.object({
    messageId: z.string().describe('The id of the permanently deleted message.'),
  }),
};
