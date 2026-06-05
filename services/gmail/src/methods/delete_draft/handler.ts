import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/delete
 * Deletes a draft. Not marked destructive: a draft is unsent and recreatable.
 */
export const delete_draft = defineMethod({
  description: 'Delete a draft.',
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.drafts.delete({ userId: 'me', id: args.draftId });
    return { draftId: args.draftId };
  },
});
