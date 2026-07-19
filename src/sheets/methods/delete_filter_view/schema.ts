import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the view.'),
    filterId: z
      .number()
      .int()
      .min(0)
      .describe(
        'The filterViewId reported by add_filter_view or get_spreadsheet for the view to delete.',
      ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
