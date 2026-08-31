import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { TableRange } from '../../entities/TableRange.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableRange: TableRange.describe(
      "The table range specifying which cells of the table to merge. Any text in the cells being merged will be concatenated and stored in the 'head' cell of the range — the upper-left cell when the content direction is left to right, the upper-right cell otherwise. If the range is non-rectangular (which can occur where the range covers cells that are already merged or where the table is non-rectangular), a 400 bad request error is returned.",
    ),
  }),
  output: BatchUpdateReceipt,
};
