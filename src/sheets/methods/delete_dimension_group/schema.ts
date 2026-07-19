import { z } from 'zod';
import { DimensionGroup } from '../../entities/DimensionGroup.js';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: DimensionRange.required({
      sheetId: true,
      dimension: true,
      startIndex: true,
      endIndex: true,
    }).describe('The zero-based half-open range of the group to delete.'),
  }),
  output: z.object({
    dimensionGroups: z
      .array(DimensionGroup)
      .describe('All groups in this dimension after the delete, as returned by Google.'),
  }),
};
