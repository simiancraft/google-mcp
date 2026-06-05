import { defineMethod } from '../../defineMethod.js';
import { projectFilter } from '../../lib/filter.js';
import { input, output } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/list */
export const list_filters = defineMethod({
  description: 'List all filters for the account.',
  input,
  output,
  handler: async (gmail) => {
    const { data } = await gmail.users.settings.filters.list({ userId: 'me' });
    return { filters: (data.filter ?? []).map(projectFilter) };
  },
});
