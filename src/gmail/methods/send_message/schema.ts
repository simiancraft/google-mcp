import { z } from 'zod';
import { Message } from '../../entities/Message.js';
import { headerSafe } from '../../lib/headers.js';

export const schema = {
  input: z.object({
    to: z.array(headerSafe).min(1).describe('Primary recipients.'),
    cc: z.array(headerSafe).optional().describe('Cc recipients.'),
    bcc: z.array(headerSafe).optional().describe('Bcc recipients.'),
    subject: headerSafe.optional().describe('The subject line.'),
    body: z.string().optional().describe('Plain-text content.'),
    htmlBody: z.string().optional().describe('HTML content.'),
    replyToMessageId: headerSafe.optional().describe('Id of the message being replied to.'),
  }),
  output: Message,
};
