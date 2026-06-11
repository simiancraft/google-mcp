import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    text: z
      .string()
      .min(1)
      .describe(
        'The text to insert. A newline character implicitly creates a new paragraph at that position.',
      ),
    index: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds (body content starts at index 1). Omitted, the text is appended at the end of the body. Indices shift on every edit; re-read the document before computing them.",
      ),
  }),
  output: BatchUpdateReceipt,
};
