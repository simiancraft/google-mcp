import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet.'),
    sheetId: z.number().int().describe('The ID of the sheet to delete.'),
  }),
  /** The delete reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the sheet was deleted from.'),
    sheetId: z.number().int().describe('The ID of the deleted sheet.'),
  }),
};
