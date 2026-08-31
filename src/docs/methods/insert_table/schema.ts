import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    rows: z.number().int().min(1).describe('The number of rows in the table.'),
    columns: z.number().int().min(1).describe('The number of columns in the table.'),
    index: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds in the body. A newline character is inserted before the table, so the table starts at this index + 1. Omitted, the table is appended at the end of the body. Indices shift on every edit; re-read the document before computing them.",
      ),
  }),
  output: BatchUpdateReceipt,
};
