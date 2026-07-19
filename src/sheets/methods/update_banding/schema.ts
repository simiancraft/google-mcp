import { z } from 'zod';
import { BandingProperties } from '../../entities/BandingProperties.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    bandedRangeId: z.number().int().min(0).describe('The ID of the banded range to update.'),
    range: GridRange.optional().describe('The new range over which the banding should apply.'),
    rowProperties: BandingProperties.optional().describe(
      'The row banding properties to update; each provided color changes independently.',
    ),
    columnProperties: BandingProperties.optional().describe(
      'The column banding properties to update; each provided color changes independently.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    bandedRangeId: z.number().int().describe('The ID of the updated banded range.'),
    updatedFields: z.string().describe('The field mask applied to the banded range.'),
  }),
};
