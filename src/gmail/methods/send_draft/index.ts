import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Irreversible: sends an existing draft, which deletes the draft and creates a
 * message with the SENT label. Returns the sent message.
 */
export const send_draft = gmailOperation({
  description: 'Send an existing draft.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  source: 'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/send',
  schema,
  handler,
});
