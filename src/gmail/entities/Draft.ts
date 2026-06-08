import { z } from 'zod';
import { EmailAddress } from './EmailAddress.js';

/**
 * An unsent message. The message contained within a draft can be replaced.
 * Sending a draft automatically deletes the draft and creates a message with the
 * SENT system label.
 *
 * Fields here are the MCP-projected shape of the REST `drafts` resource. Field
 * docs use `.describe()` so they reach the wire JSON Schema an MCP client reads.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Draft = z.object({
  id: z.string().describe('The unique identifier of the draft.'),
  subject: z.string().optional().describe('The subject line.'),
  threadId: z.string().optional().describe('The thread the draft belongs to.'),
  toRecipients: z.array(EmailAddress).optional().describe('To recipients (name and address).'),
  ccRecipients: z.array(EmailAddress).optional().describe('Cc recipients (name and address).'),
  bccRecipients: z.array(EmailAddress).optional().describe('Bcc recipients (name and address).'),
  plaintextBody: z.string().optional().describe('The plain-text body.'),
  htmlBody: z
    .string()
    .optional()
    .describe('The HTML body, extracted alongside the plain-text body.'),
  date: z.string().optional().describe('The draft date: the raw RFC 5322 Date header.'),
});

export type Draft = z.infer<typeof Draft>;
