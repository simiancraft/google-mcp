import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get
 * Fetches a single message and projects it. MINIMAL maps to `metadata`,
 * FULL_CONTENT (default) maps to `full` (decoded body + attachment ids).
 */
export const get_message = gmailOperation({
  description: 'Get a single message by id.',
  schema,
  handler,
});
