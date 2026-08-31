import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Location } from '../../entities/Location.js';
import { TableCellStyle } from '../../entities/TableCellStyle.js';
import { TableRange } from '../../entities/TableRange.js';

export const schema = {
  input: z
    .strictObject({
      documentId: z.string().describe('The ID of the document to update.'),
      tableRange: TableRange.optional().describe(
        'The table range representing the subset of the table to which the updates are applied. Exactly one of tableRange and tableStartLocation must be provided.',
      ),
      tableStartLocation: Location.optional().describe(
        'The location where the table starts in the document. When specified, the updates are applied to all the cells in the table. Exactly one of tableRange and tableStartLocation must be provided.',
      ),
      tableCellStyle: TableCellStyle.refine((style) => Object.keys(style).length > 0, {
        message: 'At least one style field must be provided.',
      }).describe(
        'The style to set on the table cells. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change. When updating borders, if a cell shares a border with an adjacent cell, the corresponding border property of the adjacent cell is updated as well.',
      ),
    })
    .refine(
      (input) => (input.tableRange === undefined) !== (input.tableStartLocation === undefined),
      {
        message: 'Exactly one of tableRange and tableStartLocation must be provided.',
      },
    ),
  output: BatchUpdateReceipt,
};
