import { z } from 'zod';
import { FilterViewReadout } from '../../entities/FilterView.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the view.'),
    filterId: z
      .number()
      .int()
      .min(0)
      .describe(
        'The filterViewId reported by add_filter_view or get_spreadsheet for the view to duplicate.',
      ),
  }),
  output: FilterViewReadout,
};
