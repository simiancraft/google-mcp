import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    dimensions: DimensionRange.describe(
      'The rows or columns to resize to fit their contents; column widths and row heights are recomputed from the rendered cell data.',
    ),
  }),
  /** The resize reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
