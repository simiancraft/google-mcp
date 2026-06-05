import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/delete
 * Deletes a user label and removes it from all messages and threads. Not marked
 * destructive: no mail is lost, and the label is recreatable.
 */
export const delete_label = defineMethod({
  description: 'Delete a user label.',
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.labels.delete({ userId: 'me', id: args.labelId });
    return { labelId: args.labelId };
  },
});
