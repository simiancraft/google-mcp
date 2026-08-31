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
        "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds in the body (page breaks cannot be inserted inside a table, equation, footnote, header, or footer, and cannot be inserted at a table's start index). Omitted, the page break is inserted at the end of the body. A newline character is inserted after the page break. Indices shift on every edit; re-read the document before computing them.",
      ),
  }),
  output: BatchUpdateReceipt,
};
