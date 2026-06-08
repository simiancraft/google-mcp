import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';
import { headerSafe } from '../../lib/headers.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/update */
export const input = z.object({
  draftId: z.string().describe('The id of the draft to replace.'),
  to: z.array(headerSafe).min(1),
  cc: z.array(headerSafe).optional(),
  bcc: z.array(headerSafe).optional(),
  subject: headerSafe.optional(),
  body: z.string().optional(),
  htmlBody: z.string().optional(),
});

export const output = Draft;
