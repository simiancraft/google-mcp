import { z } from 'zod';
import { GridRange } from './GridRange.js';

/**
 * One dimension of chart data: the grid ranges it reads. A projection of the
 * REST `ChartData` (aggregation and group rules are not carried).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ChartData
 */
export const ChartData = z.strictObject({
  sourceRange: z
    .strictObject({
      sources: z
        .array(GridRange)
        .describe(
          'The ranges to read, combined in order; each must span exactly one row or one column.',
        ),
    })
    .describe('The source ranges of the data.'),
});

export type ChartData = z.infer<typeof ChartData>;
