import { z } from 'zod';
import { headerSafe } from '../lib/headers.js';

/**
 * A local file to attach to an outgoing message. A suite extension, not a
 * Google noun: the Gmail API's compose surface takes attachments only inside
 * the documented `raw` RFC 822 field, so the compose operations
 * (`create_draft`, `update_draft`, `send_message`) accept this shape and the
 * server assembles the MIME message itself (issue #101 is the provenance).
 * The `raw` field the assembly targets is as documented as the structured
 * form.
 * @see https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages#Message
 */
export const AttachmentFile = z.strictObject({
  path: z
    .string()
    .min(1)
    .describe(
      'Absolute filesystem path, as this server process sees it (e.g. a WSL /mnt/... path), ' +
        'of the file to attach. The server reads the bytes when the message is assembled.',
    ),
  filename: headerSafe
    .min(1)
    .optional()
    .describe('Filename shown to the recipient. Defaults to the basename of `path`.'),
  mimeType: headerSafe
    .min(1)
    .optional()
    .describe(
      'MIME type of the file. Defaults to a type sniffed from the file extension, ' +
        'or application/octet-stream when the extension is unrecognized.',
    ),
});
export type AttachmentFile = z.infer<typeof AttachmentFile>;
