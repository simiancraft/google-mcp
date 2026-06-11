import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.strictObject({
    draftId: z.string().describe('The id of the draft to send.'),
  }),
  /** Sending a draft deletes it and creates a message with the SENT label. */
  output: Message,
};
