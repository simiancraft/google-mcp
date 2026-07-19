import { z } from 'zod';
import { Dimension } from '../../entities/Dimension.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to insert cells into.'),
    range: GridRange.describe('The range into which new blank cells should be inserted.'),
    shiftDimension: Dimension.describe(
      'ROWS shifts existing cells down; COLUMNS shifts existing cells right.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
