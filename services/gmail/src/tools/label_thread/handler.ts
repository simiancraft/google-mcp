import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_thread
 * Adds labels to every message in a thread via `users.threads.modify`
 * (addLabelIds); confirms the applied labels.
 */
export const label_thread = defineTool({
  description: 'Add labels to a thread.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.threads.modify({
      userId: 'me',
      id: args.threadId,
      requestBody: { addLabelIds: args.labelIds },
    });
    return { threadId: data.id ?? args.threadId, labelIds: args.labelIds };
  },
});
