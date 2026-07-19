import { z } from 'zod';
import { Dimension } from '../../entities/Dimension.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    sheetId: z.number().int().min(0).describe('The sheet to append rows or columns to.'),
    dimension: Dimension.describe('Whether rows or columns should be appended.'),
    length: z.number().int().positive().describe('The number of rows or columns to append.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
