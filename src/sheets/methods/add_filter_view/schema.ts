import { z } from 'zod';
import { FilterView, FilterViewReadout } from '../../entities/FilterView.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to add the filter view to.'),
    filter: FilterView.describe(
      'The filter view to add. filterViewId is optional; omitted, Google generates one. Provide at most one of range or namedRangeId.',
    ),
  }),
  output: FilterViewReadout,
};
