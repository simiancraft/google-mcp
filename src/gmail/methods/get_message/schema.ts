import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get */
export const schema = {
  input: z.object({
    messageId: z.string(),
    messageFormat: z.enum(['MESSAGE_FORMAT_UNSPECIFIED', 'MINIMAL', 'FULL_CONTENT']).optional(),
  }),
  output: Message,
};
