import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list
 * Lists message stubs, then fetches each with `metadata` format (headers +
 * snippet) for the projection. Use get_message for a full body.
 */
export const list_messages = gmailOperation({
  description: 'List messages using Gmail query syntax.',
  schema,
  handler,
});
