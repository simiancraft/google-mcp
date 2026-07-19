import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';
import { SortSpec } from '../../entities/SortSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the range.'),
    range: GridRange.describe('The range whose rows should be sorted.'),
    sortSpecs: z
      .array(SortSpec.required({ dimensionIndex: true, sortOrder: true }))
      .min(1)
      .describe(
        'The sort order per column; later specifications break ties from earlier ones. Color-based and Connected Sheets sort specifications are not carried.',
      ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
