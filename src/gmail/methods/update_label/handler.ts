import { defineMethod } from '../../defineMethod.js';
import { projectLabel } from '../../lib/label.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/patch
 * Patches name and/or color of a user label.
 */
export const update_label = defineMethod({
  description: 'Update a label name and/or color.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.labels.patch({
      userId: 'me',
      id: args.labelId,
      requestBody: { name: args.name, color: args.color },
    });
    return projectLabel(data);
  },
});
