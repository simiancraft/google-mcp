import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Range } from '../../entities/Range.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe('The range of content to delete.'),
  }),
  output: BatchUpdateReceipt,
};
