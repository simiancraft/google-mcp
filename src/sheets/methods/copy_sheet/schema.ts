import { z } from 'zod';
import { SheetProperties } from '../../entities/SheetProperties.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.sheets/copyTo */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet to copy.'),
    sheetId: z.number().int().describe('The ID of the sheet to copy.'),
    destinationSpreadsheetId: z
      .string()
      .describe('The ID of the spreadsheet to copy the sheet to (may be the same spreadsheet).'),
  }),
  output: SheetProperties,
};
