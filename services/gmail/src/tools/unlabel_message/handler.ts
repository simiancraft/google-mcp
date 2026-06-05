import { defineTool } from '../../defineTool.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/unlabel_message
 * Removes labels via `users.messages.modify` (removeLabelIds); returns the
 * message's resulting label ids as confirmation.
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
    return { messageId: data.id ?? args.messageId, labelIds: data.labelIds ?? [] };
  },
});
