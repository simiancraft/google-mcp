import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_message
 * Removes labels via `users.messages.modify` (removeLabelIds); confirms the
 * removed labels. (Matches `unlabel_thread`, whose thread response carries no
 * single label set, so both tools report the labels acted on.)
 */
export const unlabel_message = defineTool({
  description: 'Remove labels from a message.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.messages.modify({
      userId: 'me',
      id: args.messageId,
      requestBody: { removeLabelIds: args.labelIds },
    });
    return { messageId: data.id ?? args.messageId, labelIds: args.labelIds };
  },
});
