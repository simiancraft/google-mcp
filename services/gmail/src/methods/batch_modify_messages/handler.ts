import { defineMethod } from '../../defineMethod.js';
import { input, output } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify
 * Adds and/or removes labels across many messages in one call. Reversible.
 */
export const batch_modify_messages = defineMethod({
  description: 'Add and/or remove labels across many messages at once.',
  input,
  output,
  handler: async (gmail, args) => {
    await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: args.messageIds,
        addLabelIds: args.addLabelIds,
        removeLabelIds: args.removeLabelIds,
      },
    });
    return {
      messageIds: args.messageIds,
      addLabelIds: args.addLabelIds,
      removeLabelIds: args.removeLabelIds,
    };
  },
});
