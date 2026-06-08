import { defineTool } from '../../defineTool.js';
import { projectLabel } from '../../lib/label.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_label
 *
 * Creates a user label via `users.labels.create` and projects the result
 * (id -> labelId). `displayName` maps to the REST `name`.
 */
export const create_label = defineTool({
  description: 'Create a new label.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.labels.create({
      userId: 'me',
      requestBody: { name: args.displayName, color: args.color },
    });
    return projectLabel(data);
  },
});
