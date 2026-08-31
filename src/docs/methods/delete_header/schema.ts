import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    headerId: z
      .string()
      .min(1)
      .describe(
        "The id of the header to delete (a headerId from get_document or create_header). If the header is defined on the DocumentStyle, the first section of the document loses its header of that type; if defined on a SectionStyle, that section continues the previous section's header.",
      ),
  }),
  output: BatchUpdateReceipt,
};
