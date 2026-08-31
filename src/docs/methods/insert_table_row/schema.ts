import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { TableCellLocation } from '../../entities/TableCellLocation.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableCellLocation: TableCellLocation.describe(
      'The reference table cell location from which rows will be inserted. A new row will be inserted above (or below) the row where the reference cell is.',
    ),
    insertBelow: z
      .boolean()
      .describe(
        'Whether to insert the new row below the reference cell location: true inserts below the cell, false inserts above it.',
      ),
  }),
  output: BatchUpdateReceipt,
};
