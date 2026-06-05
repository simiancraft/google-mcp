import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_draft */
export const input = z.object({
  to: z.array(z.string()).min(1).describe('Primary recipients.'),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
  subject: z.string().optional(),
  body: z.string().optional().describe('Plain-text content.'),
  htmlBody: z.string().optional().describe('HTML content.'),
  replyToMessageId: z.string().optional().describe('Id of the message being replied to.'),
});

export const output = Draft;
