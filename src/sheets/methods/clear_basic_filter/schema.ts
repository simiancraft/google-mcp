import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet.'),
    sheetId: z.number().int().min(0).describe('The sheet whose basic filter should be cleared.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
