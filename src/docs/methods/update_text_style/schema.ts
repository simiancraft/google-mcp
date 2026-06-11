import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Range } from '../../entities/Range.js';
import { TextStyle } from '../../entities/TextStyle.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe(
      'The range of text to style; the API may extend it to include adjacent newlines.',
    ),
    textStyle: TextStyle.refine((style) => Object.keys(style).length > 0, {
      message: 'At least one style field must be provided.',
    }).describe(
      'The styles to set. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change.',
    ),
  }),
  output: BatchUpdateReceipt,
};
