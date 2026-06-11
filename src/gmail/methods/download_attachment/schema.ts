import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message the attachment belongs to.'),
    attachmentId: z.string().describe('The id of the attachment (from a message part).'),
  }),
  output: z.object({
    attachmentId: z.string().describe('The id of the downloaded attachment.'),
    size: z.number().describe('The decoded size in bytes.'),
    data: z.string().describe('The attachment bytes, base64url-encoded (as Gmail returns them).'),
  }),
};
