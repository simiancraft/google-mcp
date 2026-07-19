import { z } from 'zod';
import { BandedRange } from '../../entities/BandedRange.js';
import { BandingProperties } from '../../entities/BandingProperties.js';
import { GridRange } from '../../entities/GridRange.js';

const AddBandingProperties = BandingProperties.required({
  firstBandColorStyle: true,
  secondBandColorStyle: true,
});

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    bandedRangeId: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe(
        'An ID to assign the banded range; it must not already be used. Omitted, Google generates one.',
      ),
    range: GridRange.required({ sheetId: true }).describe(
      'The range over which the banding properties are applied.',
    ),
    rowProperties: AddBandingProperties.optional().describe(
      'Banding applied row by row, with both alternating colors required. Provide rowProperties, columnProperties, or both.',
    ),
    columnProperties: AddBandingProperties.optional().describe(
      'Banding applied column by column, with both alternating colors required. Provide rowProperties, columnProperties, or both.',
    ),
  }),
  output: BandedRange,
};
