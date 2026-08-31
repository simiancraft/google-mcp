import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    footerId: z
      .string()
      .min(1)
      .describe(
        "The id of the footer to delete (a footerId from get_document or create_footer). If the footer is defined on the DocumentStyle, the first section of the document loses its footer of that type; if defined on a SectionStyle, that section continues the previous section's footer.",
      ),
  }),
  output: BatchUpdateReceipt,
};
