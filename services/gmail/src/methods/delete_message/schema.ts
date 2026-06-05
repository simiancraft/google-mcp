import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/delete */
export const input = z.object({
  messageId: z.string().describe('The id of the message to permanently delete.'),
});

/** Delete returns no body; we confirm the id. Prefer trash_message unless permanence is intended. */
export const output = z.object({
  messageId: z.string(),
});
