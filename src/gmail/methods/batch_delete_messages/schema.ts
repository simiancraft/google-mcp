import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    messageIds: z.array(z.string()).describe('The ids of the messages to permanently delete.'),
  }),
  /** batchDelete returns no body; we confirm the ids. Prefer trashing unless permanence is intended. */
  output: z.object({
    messageIds: z.array(z.string()).describe('The ids of the permanently deleted messages.'),
  }),
};
