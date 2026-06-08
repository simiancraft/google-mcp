import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify */
export const schema = {
  input: z.object({
    messageIds: z.array(z.string()).describe('The ids of the messages to modify.'),
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
  }),
  output: z.object({
    messageIds: z.array(z.string()),
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
  }),
};
