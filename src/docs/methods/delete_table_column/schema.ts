import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { TableCellLocation } from '../../entities/TableCellLocation.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableCellLocation: TableCellLocation.describe(
      'The reference table cell location from which the column will be deleted. The column this cell spans will be deleted. If this is a merged cell that spans multiple columns, all columns that the cell spans will be deleted. If no columns remain in the table after this deletion, the whole table is deleted.',
    ),
  }),
  output: BatchUpdateReceipt,
};
