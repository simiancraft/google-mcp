import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    dimensions: DimensionRange.required({ sheetId: true, dimension: true }).describe(
      'The rows or columns to resize to fit their contents; column widths and row heights are recomputed from the rendered cell data. sheetId and dimension are required; the indexes may be omitted for an unbounded side.',
    ),
  }),
  /** The resize reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
