import { z } from 'zod';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/delete */
export const input = z.object({
  draftId: z.string().describe('The id of the draft to delete.'),
});

/** Delete returns no body; we confirm the id. */
export const output = z.object({
  draftId: z.string(),
});
