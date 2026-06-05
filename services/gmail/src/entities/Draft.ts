import { z } from 'zod';

/** Source: object (Draft) on the Gmail MCP reference. An unsent draft, projected. */
export const Draft = z.object({
  /** The unique identifier of the draft. */
  id: z.string(),
  /** The subject line. */
  subject: z.string().optional(),
  /** The thread the draft belongs to. */
  threadId: z.string().optional(),
  /** To recipient addresses. */
  toRecipients: z.array(z.string()).optional(),
  /** Cc recipient addresses. */
  ccRecipients: z.array(z.string()).optional(),
  /** Bcc recipient addresses. */
  bccRecipients: z.array(z.string()).optional(),
  /** The plain-text body. */
  plaintextBody: z.string().optional(),
  /** The draft date, ISO 8601. */
  date: z.string().optional(),
});

export type Draft = z.infer<typeof Draft>;
