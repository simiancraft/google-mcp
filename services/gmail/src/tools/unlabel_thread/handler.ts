import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_thread
 * Removes labels from every message in a thread via `users.threads.modify`
 * (removeLabelIds); confirms the removed labels.
 */
export const unlabel_thread = defineTool({
  description: 'Remove labels from a thread.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.threads.modify({
      userId: 'me',
      id: args.threadId,
      requestBody: { removeLabelIds: args.labelIds },
    });
    return { threadId: data.id ?? args.threadId, labelIds: args.labelIds };
  },
});
