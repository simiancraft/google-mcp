import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Location } from '../../entities/Location.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableStartLocation: Location.describe('The location where the table starts in the document.'),
    pinnedHeaderRowsCount: z
      .number()
      .int()
      .min(0)
      .describe('The number of table rows to pin, where 0 implies that all rows are unpinned.'),
  }),
  output: BatchUpdateReceipt,
};
