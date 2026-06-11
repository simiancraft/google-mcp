import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    dataFilters: z
      .array(DataFilter)
      .min(1)
      .describe(
        'The DataFilters used to determine which ranges to clear; ranges matching any filter are cleared.',
      ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The spreadsheet the updates were applied to.'),
    clearedRanges: z
      .array(z.string())
      .optional()
      .describe(
        'The ranges that were cleared, in A1 notation; for an unbounded request, the actual extents that were cleared.',
      ),
  }),
};
