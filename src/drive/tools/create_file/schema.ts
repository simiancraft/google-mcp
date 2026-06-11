import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    title: z.string().describe('The title of the file.'),
    contentMimeType: z
      .string()
      .optional()
      .describe(
        'MIME type of the content being uploaded; required when providing content. ' +
          'Google-native types (e.g. application/vnd.google-apps.document) can be created ' +
          'without content.',
      ),
    textContent: z
      .string()
      .optional()
      .describe('UTF-8 text content to upload; cannot be set with base64Content.'),
    base64Content: z
      .string()
      .optional()
      .describe('Base64-encoded content for non-UTF8 data; cannot be set with textContent.'),
    parentId: z.string().optional().describe('Parent folder ID for the file.'),
    disableConversionToGoogleType: z
      .boolean()
      .optional()
      .describe(
        'Set true to retain the content MIME type instead of converting to a Google format ' +
          '(text/plain converts to Google Docs, text/csv to Google Sheets).',
      ),
  }),
  output: File,
};
