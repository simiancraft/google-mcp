import { defineMethod } from '../../defineMethod.js';
import { projectDraft } from '../../lib/message.js';
import { input, output } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/get */
export const get_draft = defineMethod({
  description: 'Get a draft by id.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.drafts.get({
      userId: 'me',
      id: args.draftId,
      format: 'full',
    });
    return projectDraft(data);
  },
});
