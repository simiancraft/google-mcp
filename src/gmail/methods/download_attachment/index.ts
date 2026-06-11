import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Returns the attachment bytes base64url-encoded, as Gmail returns them.
 */
export const download_attachment = gmailOperation({
  description: 'Download a message attachment (base64url-encoded bytes).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages.attachments/get',
  schema,
  handler,
});
