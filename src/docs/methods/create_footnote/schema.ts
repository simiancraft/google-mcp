import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    index: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        "The zero-based UTF-16 index to insert the footnote reference at, inside an existing paragraph's bounds in the body (footnote references cannot be inserted inside an equation, header, footer, or another footnote, and cannot be inserted at a table's start index). Omitted, the reference is inserted at the end of the body. Indices shift on every edit; re-read the document before computing them.",
      ),
  }),
  output: BatchUpdateReceipt.extend({
    footnoteId: z
      .string()
      .describe(
        'The ID of the created footnote segment: the segmentId that insert_text and the styling ranges take to write the footnote text (the new segment contains a space followed by a newline).',
      ),
  }),
};
