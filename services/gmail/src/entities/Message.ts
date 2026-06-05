import { z } from 'zod';

/** Source: object (Message) on the Gmail MCP reference. A single message, projected. */
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
  /** Attachment identifiers (FULL_CONTENT only). */
  attachmentIds: z.array(z.string()).optional(),
});

export type Message = z.infer<typeof Message>;
