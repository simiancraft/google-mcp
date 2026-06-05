import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_message
 * Adds labels via `users.messages.modify` (addLabelIds); returns the message's
 * resulting label ids as confirmation.
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
    return { messageId: data.id ?? args.messageId, labelIds: data.labelIds ?? [] };
  },
});
