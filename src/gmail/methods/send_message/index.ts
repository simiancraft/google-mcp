import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
 *
 * Irreversible: assembles an RFC 822 message and sends it immediately. When
 * `replyToMessageId` is given, the original is fetched for its thread and
 * Message-ID so the reply threads correctly.
 */
export const send_message = gmailOperation({
  description: 'Send an email immediately.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  schema,
  handler,
});
