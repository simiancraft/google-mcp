import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { ParagraphStyle } from '../../entities/ParagraphStyle.js';
import { Range } from '../../entities/Range.js';

export const schema = {
  input: z.object({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe('The range overlapping the paragraphs to style.'),
    paragraphStyle: ParagraphStyle.refine((style) => Object.keys(style).length > 0, {
      message: 'At least one style field must be provided.',
    }).describe(
      'The styles to set on every paragraph the range overlaps. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change.',
    ),
  }),
  output: BatchUpdateReceipt,
};
