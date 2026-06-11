import { z } from 'zod';
import { Spreadsheet } from '../../entities/Spreadsheet.js';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The spreadsheet to retrieve.'),
  }),
  output: Spreadsheet,
};
