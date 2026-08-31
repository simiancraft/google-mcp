import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { TableCellLocation } from '../../entities/TableCellLocation.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableCellLocation: TableCellLocation.describe(
      'The reference table cell location from which columns will be inserted. A new column will be inserted to the left (or right) of the column where the reference cell is.',
    ),
    insertRight: z
      .boolean()
      .describe(
        'Whether to insert the new column to the right of the reference cell location: true inserts to the right, false inserts to the left.',
      ),
  }),
  output: BatchUpdateReceipt,
};
