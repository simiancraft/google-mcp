import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/send
 *
 * Irreversible: sends an existing draft, which deletes the draft and creates a
 * message with the SENT label. Returns the sent message.
 */
export const send_draft = operation({
  description: 'Send an existing draft.',
  destructive: true,
  schema,
  handler,
});
