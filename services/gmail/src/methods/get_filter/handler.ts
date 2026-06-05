import { defineMethod } from '../../defineMethod.js';
import { projectFilter } from '../../lib/filter.js';
import { input, output } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/get */
export const get_filter = defineMethod({
  description: 'Get a filter by id.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.settings.filters.get({ userId: 'me', id: args.filterId });
    return projectFilter(data);
  },
});
