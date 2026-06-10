import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/send */
export const schema = {
  input: z.object({
    draftId: z.string().describe('The id of the draft to send.'),
  }),
  /** Sending a draft deletes it and creates a message with the SENT label. */
  output: Message,
};
