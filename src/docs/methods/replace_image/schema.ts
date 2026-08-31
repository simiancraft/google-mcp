import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    imageObjectId: z
      .string()
      .min(1)
      .describe(
        'The ID of the existing image to replace (an objectId from insert_inline_image, or retrieved from a get request).',
      ),
    uri: z
      .string()
      .min(1)
      .max(2048)
      .describe(
        'The URI of the new image: publicly accessible, at most 2 kB in length, fetched once at insertion time (a copy is stored for display). Images must be less than 50MB, cannot exceed 25 megapixels, and must be in PNG, JPEG, or GIF format.',
      ),
    imageReplaceMethod: z
      .enum(['CENTER_CROP'])
      .optional()
      .describe(
        "The replacement method. CENTER_CROP (the API's only method) scales and centers the new image to fill the original image's bounds, cropping as needed; the rendered size stays that of the original image.",
      ),
  }),
  output: BatchUpdateReceipt,
};
