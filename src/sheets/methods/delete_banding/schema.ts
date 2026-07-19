import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the banded range.'),
    bandedRangeId: z.number().int().min(0).describe('The ID of the banded range to delete.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    bandedRangeId: z.number().int().describe('The ID of the deleted banded range.'),
  }),
};
