import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z
    .strictObject({
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
        .min(0)
        .optional()
        .describe(
          "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds, relative to the beginning of the segment (body content starts at index 1; header, footer, and footnote content starts at index 0). Omitted, the text is appended at the end of the segment. Indices shift on every edit; re-read the document before computing them.",
        ),
      segmentId: z
        .string()
        .optional()
        .describe(
          "The ID of the header, footer, or footnote to insert into (a headerId, footerId, or footnoteId from get_document). An empty or omitted segment ID signifies the document's body.",
        ),
    })
    .refine(
      (input) =>
        input.index === undefined ||
        input.index >= 1 ||
        (input.segmentId !== undefined && input.segmentId !== ''),
      {
        message:
          'index 0 addresses a segment; body insertions start at index 1 (index 0 is the initial section break).',
      },
    ),
  output: BatchUpdateReceipt,
};
