import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the range.'),
    range: GridRange.describe('The range whose rows should be randomized.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
