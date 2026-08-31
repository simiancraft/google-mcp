import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Location } from '../../entities/Location.js';
import { TableColumnProperties } from '../../entities/TableColumnProperties.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    tableStartLocation: Location.describe('The location where the table starts in the document.'),
    columnIndices: z
      .array(z.number().int().min(0))
      .optional()
      .describe(
        'The list of zero-based column indices whose property should be updated. If no indices are specified, all columns will be updated.',
      ),
    tableColumnProperties: TableColumnProperties.refine(
      (properties) => Object.keys(properties).length > 0,
      { message: 'At least one property field must be provided.' },
    )
      .refine(
        (properties) => properties.widthType !== 'FIXED_WIDTH' || properties.width !== undefined,
        { message: 'A widthType of FIXED_WIDTH requires the width field.' },
      )
      .describe(
        'The table column properties to update. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change.',
      ),
  }),
  output: BatchUpdateReceipt,
};
