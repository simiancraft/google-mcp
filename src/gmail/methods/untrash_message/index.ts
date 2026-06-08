import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/untrash
 * Reversible: removes a message from the trash.
 */
export const untrash_message = operation({
  description: 'Remove a message from the trash.',
  schema,
  handler,
});
