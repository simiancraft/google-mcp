import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Fetches a single message and projects it. MINIMAL maps to `metadata`,
 * FULL_CONTENT (default) maps to `full` (decoded body + attachment ids).
 */
export const get_message = gmailOperation({
  description: 'Get a single message by id.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get',
  schema,
  handler,
});
