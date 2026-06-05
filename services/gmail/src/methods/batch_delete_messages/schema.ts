import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchDelete */
export const input = z.object({
  messageIds: z.array(z.string()).describe('The ids of the messages to permanently delete.'),
});

/** batchDelete returns no body; we confirm the ids. Prefer trashing unless permanence is intended. */
export const output = z.object({
  messageIds: z.array(z.string()),
});
