import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Location } from '../../entities/Location.js';
import { TableRowStyle } from '../../entities/TableRowStyle.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableStartLocation: Location.describe('The location where the table starts in the document.'),
    rowIndices: z
      .array(z.number().int().min(0))
      .optional()
      .describe(
        'The list of zero-based row indices whose style should be updated. If no indices are specified, all rows will be updated.',
      ),
    tableRowStyle: TableRowStyle.refine((style) => Object.keys(style).length > 0, {
      message: 'At least one style field must be provided.',
    }).describe(
      'The styles to set on the rows. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change.',
    ),
  }),
  output: BatchUpdateReceipt,
};
