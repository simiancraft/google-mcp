import { z } from 'zod';
import { Range } from '../../entities/Range.js';

export const schema = {
  input: z.object({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe('The range of content to delete.'),
  }),
  output: z.object({
    documentId: z.string().describe('The document the update was applied to.'),
    revisionId: z
      .string()
      .optional()
      .describe('The revision of the document after the write, when Google reports one.'),
  }),
};
