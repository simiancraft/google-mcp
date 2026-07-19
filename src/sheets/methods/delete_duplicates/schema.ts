import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the range.'),
    range: GridRange.describe('The range from which duplicate rows should be removed.'),
    comparisonColumns: z
      .array(DimensionRange.required({ sheetId: true, dimension: true }))
      .optional()
      .describe(
        'The columns within the range to compare. Omitted, every column is compared. Each dimension must be COLUMNS.',
      ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    duplicatesRemovedCount: z.number().int().describe('The number of duplicate rows removed.'),
  }),
};
