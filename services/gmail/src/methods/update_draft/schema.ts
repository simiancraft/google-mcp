import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/update */
export const input = z.object({
  draftId: z.string().describe('The id of the draft to replace.'),
  to: z.array(z.string()).min(1),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
  subject: z.string().optional(),
  body: z.string().optional(),
  htmlBody: z.string().optional(),
});

export const output = Draft;
