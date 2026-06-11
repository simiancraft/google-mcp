import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Reversible: removes a message from the trash.
 */
export const untrash_message = gmailOperation({
  description: 'Remove a message from the trash.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/untrash',
  schema,
  handler,
});
