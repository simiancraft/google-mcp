import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Returns the attachment bytes base64url-encoded, as Gmail returns them, or
 * writes them to disk and returns the path when `savePath` is set (avoiding a
 * large base64 payload in the response).
 */
export const download_attachment = gmailOperation({
  description:
    'Download a message attachment. Returns base64url-encoded bytes inline, or writes them to disk and returns the path when savePath is set.',
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
