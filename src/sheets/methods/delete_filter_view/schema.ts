import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the view.'),
    filterViewId: z.number().int().min(0).describe('The ID of the filter view to delete.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
