import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    name: z
      .string()
      .optional()
      .describe("The name of the file. This isn't necessarily unique within a folder."),
    description: z.string().optional().describe('A short description of the file.'),
    starred: z.boolean().optional().describe('Whether the user has starred the file.'),
    folderColorRgb: z
      .string()
      .optional()
      .describe(
        'The color for a folder or a shortcut to a folder as an RGB hex string. If an ' +
          'unsupported color is specified, the closest color in the palette is used instead.',
      ),
    copyRequiresWriterPermission: z
      .boolean()
      .optional()
      .describe(
        'Whether the options to copy, print, or download this file should be disabled for ' +
          'readers and commenters.',
      ),
    writersCanShare: z
      .boolean()
      .optional()
      .describe(
        "Whether users with only writer permission can modify the file's permissions. " +
          'Not populated for items in shared drives.',
      ),
    addParents: z.string().optional().describe('A comma-separated list of parent IDs to add.'),
    removeParents: z
      .string()
      .optional()
      .describe('A comma-separated list of parent IDs to remove.'),
  }),
  output: File,
};
