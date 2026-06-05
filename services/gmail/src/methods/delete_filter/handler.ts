import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/delete
 * Deletes a filter. Not marked destructive: no mail is lost and a filter is recreatable.
 */
export const delete_filter = defineMethod({
  description: 'Delete a filter.',
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.settings.filters.delete({ userId: 'me', id: args.filterId });
    return { filterId: args.filterId };
  },
});
