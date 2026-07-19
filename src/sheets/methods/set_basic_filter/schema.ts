import { z } from 'zod';
import { BasicFilter } from '../../entities/BasicFilter.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet.'),
    filter: BasicFilter.required({ range: true }).describe(
      'The range-backed basic filter to set, including optional sorts and per-column criteria.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
