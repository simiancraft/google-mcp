import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    messageId: z.string().describe('The id of the message the attachment belongs to.'),
    attachmentId: z.string().describe('The id of the attachment (from a message part).'),
    savePath: z
      .string()
      .optional()
      .describe(
        'Absolute filesystem path, as this server process sees it (e.g. a WSL /mnt/... path), ' +
          'to write the decoded attachment bytes to. When set, the bytes are written to disk and ' +
          '`data` is omitted from the response (no large base64 payload); `path` is returned instead. ' +
          'Parent directories are created if missing.',
      ),
  }),
  output: z.object({
    attachmentId: z.string().describe('The id of the downloaded attachment.'),
    size: z.number().describe('The decoded size in bytes.'),
    data: z
      .string()
      .optional()
      .describe(
        'The attachment bytes, base64url-encoded (as Gmail returns them). Omitted when savePath was set.',
      ),
    path: z
      .string()
      .optional()
      .describe(
        'The path the attachment bytes were written to. Present only when savePath was set.',
      ),
  }),
};
