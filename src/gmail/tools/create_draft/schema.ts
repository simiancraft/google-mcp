import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';
import { headerSafe } from '../../lib/headers.js';

export const schema = {
  input: z.object({
    to: z.array(headerSafe).min(1).describe('Primary recipients.'),
    cc: z.array(headerSafe).optional(),
    bcc: z.array(headerSafe).optional(),
    subject: headerSafe.optional(),
    body: z.string().optional().describe('Plain-text content.'),
    htmlBody: z.string().optional().describe('HTML content.'),
    replyToMessageId: headerSafe.optional().describe('Id of the message being replied to.'),
  }),
  output: Draft,
};
