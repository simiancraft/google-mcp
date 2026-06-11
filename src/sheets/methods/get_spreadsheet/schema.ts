import { z } from 'zod';
import { Spreadsheet } from '../../entities/Spreadsheet.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/get */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The spreadsheet to retrieve.'),
  }),
  output: Spreadsheet,
};
