import { z } from 'zod';
import { FilterView } from '../../entities/FilterView.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the view.'),
    filterViewId: z.number().int().min(0).describe('The ID of the filter view to duplicate.'),
  }),
  output: FilterView.required({ filterViewId: true }),
};
