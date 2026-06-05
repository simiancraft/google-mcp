import { z } from 'zod';

/**
 * An email message containing the sender, recipients, subject, and body. Once a
 * message is created, it cannot be changed.
 *
 * Fields here are the MCP-projected shape (a flattened subset of the REST
 * `messages` resource).
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Message = z.object({
  /** The unique identifier of the message. */
  id: z.string(),
  /** A short excerpt of the message body. */
  snippet: z.string().optional(),
  /** The subject, from headers. */
  subject: z.string().optional(),
  /** The sender email address, from headers. */
  sender: z.string().optional(),
  /** To recipient addresses, from headers. */
  toRecipients: z.array(z.string()).optional(),
  /** Cc recipient addresses, from headers. */
  ccRecipients: z.array(z.string()).optional(),
  /** The message date, ISO 8601. */
  date: z.string().optional(),
  /** The plain-text body (FULL_CONTENT only). */
  plaintextBody: z.string().optional(),
  /** The HTML body (FULL_CONTENT only). Extracted alongside the plain-text body. */
  htmlBody: z.string().optional(),
  /** Attachment identifiers (FULL_CONTENT only). */
  attachmentIds: z.array(z.string()).optional(),
});

export type Message = z.infer<typeof Message>;
