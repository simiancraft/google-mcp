import { defineMethod } from '../../defineMethod.js';
import { projectLabel } from '../../lib/label.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/get
 * `labels.get` (unlike `labels.list`) includes the color and thread counts.
 */
export const get_label = defineMethod({
  description: 'Get a label by id (includes color and thread counts).',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.labels.get({ userId: 'me', id: args.labelId });
    return projectLabel(data);
  },
});
