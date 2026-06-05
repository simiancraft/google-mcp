import { defineMethod } from '../../defineMethod.js';
import { projectFilter } from '../../lib/filter.js';
import { input, output } from './schema.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/create */
export const create_filter = defineMethod({
  description: 'Create a filter (criteria plus actions).',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.settings.filters.create({
      userId: 'me',
      requestBody: { criteria: args.criteria, action: args.action },
    });
    return projectFilter(data);
  },
});
