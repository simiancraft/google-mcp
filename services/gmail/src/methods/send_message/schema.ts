import { z } from 'zod';
import { Message } from '../../entities/Message.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send */
export const input = z.object({
  to: z.array(z.string()).min(1).describe('Primary recipients.'),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
  subject: z.string().optional(),
  body: z.string().optional().describe('Plain-text content.'),
  htmlBody: z.string().optional().describe('HTML content.'),
  replyToMessageId: z.string().optional().describe('Id of the message being replied to.'),
});

export const output = Message;
