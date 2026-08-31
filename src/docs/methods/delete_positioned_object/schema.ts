import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    objectId: z.string().min(1).describe('The ID of the positioned object to delete.'),
  }),
  output: BatchUpdateReceipt,
};
