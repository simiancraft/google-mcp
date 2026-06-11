import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file to retrieve.'),
    exportMimeType: z
      .string()
      .optional()
      .describe(
        'For Google native files, the MIME type to export the file to, ignored otherwise. ' +
          'Defaults to text if not specified.',
      ),
  }),
  output: z.object({
    id: z.string().describe('The id of the file that was fetched.'),
    title: z.string().optional().describe('The title of the file.'),
    mimeType: z.string().optional().describe('The mime type of the content returned.'),
    content: z.string().describe('The base64 encoded content of the file.'),
  }),
};
