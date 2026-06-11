import { z } from 'zod';

export const schema = {
  input: z.object({
    messageId: z.string().describe('The id of the message the attachment belongs to.'),
    attachmentId: z.string().describe('The id of the attachment (from a message part).'),
  }),
  output: z.object({
    attachmentId: z.string(),
    size: z.number(),
    /** The attachment bytes, base64url-encoded (as Gmail returns them). */
    data: z.string(),
  }),
};
