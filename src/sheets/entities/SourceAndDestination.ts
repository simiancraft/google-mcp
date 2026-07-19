import { z } from 'zod';
import { Dimension } from './Dimension.js';
import { GridRange } from './GridRange.js';

/**
 * A source range and the direction and distance through which to extend it.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#SourceAndDestination
 */
export const SourceAndDestination = z.strictObject({
  source: GridRange.describe('The location of the data to use as the autofill source.'),
  dimension: Dimension.describe('The dimension into which data should be filled.'),
  fillLength: z
    .number()
    .int()
    .describe(
      'The number of rows or columns to fill; positive extends after the source and negative extends before it.',
    ),
});

export type SourceAndDestination = z.infer<typeof SourceAndDestination>;
