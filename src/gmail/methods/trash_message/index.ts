import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/trash
 * Reversible: moves a message to the trash (undo with untrash_message).
 */
export const trash_message = operation({
  description: 'Move a message to the trash.',
  schema,
  handler,
});
