import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_message
 * Adds labels via `users.messages.modify` (addLabelIds); confirms the applied
 * labels. (Matches `label_thread`, whose thread response carries no single label
 * set, so both tools report the labels acted on rather than the resulting state.)
 */
export const label_message = defineTool({
  description: 'Add labels to a message.',
  input,
  output,
  handler: async (gmail, args) => {
    const { data } = await gmail.users.messages.modify({
      userId: 'me',
      id: args.messageId,
      requestBody: { addLabelIds: args.labelIds },
    });
    return { messageId: data.id ?? args.messageId, labelIds: args.labelIds };
  },
});
