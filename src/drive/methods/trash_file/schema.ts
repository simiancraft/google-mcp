import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file to move to the trash.'),
  }),
  output: File,
};
