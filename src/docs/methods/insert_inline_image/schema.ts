import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z
    .strictObject({
      documentId: z.string().describe('The ID of the document to update.'),
      uri: z
        .string()
        .min(1)
        .max(2048)
        .describe(
          'The image URI: publicly accessible, at most 2 kB in length, fetched once at insertion time (a copy is stored for display). Images must be less than 50MB, cannot exceed 25 megapixels, and must be in PNG, JPEG, or GIF format.',
        ),
      width: z
        .number()
        .positive()
        .optional()
        .describe(
          'The width the image should appear as, in points. With only one dimension given the other is calculated to preserve aspect ratio; with both, the image is scaled to fit within them while keeping its aspect ratio; with neither, a default size is calculated from its resolution.',
        ),
      height: z
        .number()
        .positive()
        .optional()
        .describe(
          'The height the image should appear as, in points. With only one dimension given the other is calculated to preserve aspect ratio; with both, the image is scaled to fit within them while keeping its aspect ratio; with neither, a default size is calculated from its resolution.',
        ),
      index: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe(
          "The zero-based UTF-16 index to insert at, inside an existing paragraph's bounds, relative to the beginning of the segment (body content starts at index 1; header and footer content starts at index 0). Inline images cannot be inserted inside a footnote or equation, or at a table's start index. Omitted, the image is inserted at the end of the segment. Indices shift on every edit; re-read the document before computing them.",
        ),
      segmentId: z
        .string()
        .optional()
        .describe(
          "The ID of the header or footer to insert into (a headerId or footerId from get_document); inline images cannot be inserted inside a footnote. An empty or omitted segment ID signifies the document's body.",
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
  output: BatchUpdateReceipt.extend({
    objectId: z
      .string()
      .describe('The ID of the created inline image object; the handle replace_image takes.'),
  }),
};
