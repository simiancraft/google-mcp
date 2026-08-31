import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { DocumentStyle } from '../../entities/DocumentStyle.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    documentStyle: DocumentStyle.refine((style) => Object.keys(style).length > 0, {
      message: 'At least one style field must be provided.',
    }).describe(
      'The styles to set on the document. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change. Certain changes may cause other changes in order to mirror the behavior of the Docs editor.',
    ),
  }),
  output: BatchUpdateReceipt,
};
