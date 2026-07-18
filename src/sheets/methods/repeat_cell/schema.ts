import { z } from 'zod';
import { CellFormat } from '../../entities/CellFormat.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to format.'),
    range: GridRange.describe('The cells to format.'),
    format: CellFormat.describe(
      'The format to apply to every cell in the range; only the fields provided change, and cell values are untouched.',
    ),
  }),
  /** The format reply is empty; we confirm the id and the mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    updatedFields: z
      .string()
      .describe('The field mask that was applied, one path per format field provided.'),
  }),
};
