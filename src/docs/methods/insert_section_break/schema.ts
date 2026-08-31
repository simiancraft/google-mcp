import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    sectionType: z
      .enum(['NEXT_PAGE', 'CONTINUOUS'])
      .describe(
        'The type of section to insert: NEXT_PAGE starts the new section on a new page, CONTINUOUS starts it on the same page as the previous paragraph.',
      ),
    index: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds in the body (section breaks cannot be inserted inside a table, equation, footnote, header, or footer). Omitted, the section break is inserted at the end of the body. A newline character is inserted before the section break. Indices shift on every edit; re-read the document before computing them.",
      ),
  }),
  output: BatchUpdateReceipt,
};
