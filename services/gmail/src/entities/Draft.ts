import { z } from 'zod';
import { EmailAddress } from './EmailAddress.js';

/**
 * An unsent message. The message contained within a draft can be replaced.
 * Sending a draft automatically deletes the draft and creates a message with the
 * SENT system label.
 *
 * Fields here are the MCP-projected shape of the REST `drafts` resource.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Draft = z.object({
  /** The unique identifier of the draft. */
  id: z.string(),
  /** The subject line. */
  subject: z.string().optional(),
  /** The thread the draft belongs to. */
  threadId: z.string().optional(),
  /** To recipients (name and address). */
  toRecipients: z.array(EmailAddress).optional(),
  /** Cc recipients (name and address). */
  ccRecipients: z.array(EmailAddress).optional(),
  /** Bcc recipients (name and address). */
  bccRecipients: z.array(EmailAddress).optional(),
  /** The plain-text body. */
  plaintextBody: z.string().optional(),
  /** The HTML body. Extracted alongside the plain-text body. */
  htmlBody: z.string().optional(),
  /** The draft date, ISO 8601. */
  date: z.string().optional(),
});

export type Draft = z.infer<typeof Draft>;
