import { z } from 'zod';
import { Revision } from '../../entities/Revision.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    revisionId: z.string().describe('The ID of the revision.'),
  }),
  output: Revision,
};
