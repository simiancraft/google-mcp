import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    type: z
      .enum(['DEFAULT'])
      .describe('The type of footer to create (DEFAULT is the only creatable type).'),
    sectionBreakIndex: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        'The index of the SectionBreak immediately preceding the section whose SectionStyle this footer should belong to. Omitted, or referring to the first section break in the document, the footer applies to the DocumentStyle (the whole document).',
      ),
  }),
  output: BatchUpdateReceipt.extend({
    footerId: z
      .string()
      .describe(
        'The ID of the created footer: the segmentId that insert_text and the styling ranges take to write into it, and the handle delete_footer takes.',
      ),
  }),
};
