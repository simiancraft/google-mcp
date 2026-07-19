import { z } from 'zod';
import { Dimension } from '../../entities/Dimension.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to delete cells from.'),
    range: GridRange.describe('The range of cells to delete.'),
    shiftDimension: Dimension.describe(
      'ROWS shifts existing cells upward; COLUMNS shifts existing cells left.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
