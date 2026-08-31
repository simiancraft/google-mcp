import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { TableCellLocation } from '../../entities/TableCellLocation.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableCellLocation: TableCellLocation.describe(
      'The reference table cell location from which the row will be deleted. The row this cell spans will be deleted. If this is a merged cell that spans multiple rows, all rows that the cell spans will be deleted. If no rows remain in the table after this deletion, the whole table is deleted.',
    ),
  }),
  output: BatchUpdateReceipt,
};
