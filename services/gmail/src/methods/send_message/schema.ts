import { z } from 'zod';
import { Message } from '../../entities/Message.js';
import { headerSafe } from '../../lib/headers.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send */
export const input = z.object({
  to: z.array(headerSafe).min(1).describe('Primary recipients.'),
  cc: z.array(headerSafe).optional(),
  bcc: z.array(headerSafe).optional(),
  subject: headerSafe.optional(),
  body: z.string().optional().describe('Plain-text content.'),
  htmlBody: z.string().optional().describe('HTML content.'),
  replyToMessageId: headerSafe.optional().describe('Id of the message being replied to.'),
});

export const output = Message;
