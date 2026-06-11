import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file to copy.'),
    title: z
      .string()
      .optional()
      .describe(
        "The title of the newly created file. If empty, the title will be 'Copy of [original file title]'.",
      ),
    parentId: z
      .string()
      .optional()
      .describe(
        'The parent id of the newly created file. If empty, the file will be created with the ' +
          'same parent as the original file.',
      ),
  }),
  output: File,
};
