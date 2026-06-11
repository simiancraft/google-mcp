import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Adds and/or removes labels across many messages in one call. Reversible.
 */
export const batch_modify_messages = gmailOperation({
  description: 'Add and/or remove labels across many messages at once.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/batchModify',
  schema,
  handler,
});
