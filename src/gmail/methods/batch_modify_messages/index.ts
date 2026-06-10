import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify
 * Adds and/or removes labels across many messages in one call. Reversible.
 */
export const batch_modify_messages = gmailOperation({
  description: 'Add and/or remove labels across many messages at once.',
  schema,
  handler,
});
