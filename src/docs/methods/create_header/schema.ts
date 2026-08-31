import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    type: z
      .enum(['DEFAULT'])
      .describe('The type of header to create (DEFAULT is the only creatable type).'),
    sectionBreakIndex: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe(
        'The index of the SectionBreak which begins the section this header should belong to. Omitted, or referring to the first section break in the document body, the header applies to the DocumentStyle (the whole document).',
      ),
  }),
  output: BatchUpdateReceipt.extend({
    headerId: z
      .string()
      .describe(
        'The ID of the created header: the segmentId that insert_text and the styling ranges take to write into it, and the handle delete_header takes.',
      ),
  }),
};
