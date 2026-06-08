import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/delete */
export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message to permanently delete.'),
  }),
  output: z.object({
    messageId: z.string(),
  }),
};
