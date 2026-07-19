import { z } from 'zod';
import { BandingProperties } from './BandingProperties.js';
import { GridRange } from './GridRange.js';

/**
 * A range in a sheet with alternating row or column colors.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BandedRange
 */
export const BandedRange = z.strictObject({
  bandedRangeId: z
    .number()
    .int()
    .min(0)
    .describe('The ID of the banded range, used to update or delete it.'),
  range: GridRange.optional().describe('The range over which the banding properties apply.'),
  rowProperties: BandingProperties.optional().describe(
    'Banding applied row by row. If row and column properties are both present, row properties take priority where they overlap.',
  ),
  columnProperties: BandingProperties.optional().describe(
    'Banding applied column by column. At least one of rowProperties or columnProperties is required when adding a banded range.',
  ),
});

export type BandedRange = z.infer<typeof BandedRange>;
