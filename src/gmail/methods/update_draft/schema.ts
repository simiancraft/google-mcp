import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';
import { headerSafe } from '../../lib/headers.js';

export const schema = {
  input: z.object({
    draftId: z.string().describe('The id of the draft to replace.'),
    to: z
      .array(headerSafe)
      .min(1)
      .describe('Primary recipients (the draft is replaced, not patched).'),
    cc: z.array(headerSafe).optional().describe('Cc recipients.'),
    bcc: z.array(headerSafe).optional().describe('Bcc recipients.'),
    subject: headerSafe.optional().describe('The subject line.'),
    body: z.string().optional().describe('Plain-text content.'),
    htmlBody: z.string().optional().describe('HTML content.'),
  }),
  output: Draft,
};
