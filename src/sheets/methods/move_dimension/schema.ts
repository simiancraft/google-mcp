import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    source: DimensionRange.required({
      sheetId: true,
      dimension: true,
      startIndex: true,
      endIndex: true,
    }).describe('The zero-based half-open row or column range to move.'),
    destinationIndex: z
      .number()
      .int()
      .min(0)
      .describe(
        'The zero-based destination start index, measured before the source is removed. The moved dimensions can land at a different final index after removal.',
      ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
