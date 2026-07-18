import { z } from 'zod';
import { ChartData } from './ChartData.js';

/**
 * A pie chart. A projection of the REST `PieChartSpec`.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#PieChartSpec
 */
export const PieChartSpec = z.strictObject({
  legendPosition: z
    .enum([
      'BOTTOM_LEGEND',
      'LEFT_LEGEND',
      'RIGHT_LEGEND',
      'TOP_LEGEND',
      'NO_LEGEND',
      'LABELED_LEGEND',
    ])
    .optional()
    .describe('Where the legend renders.'),
  domain: ChartData.optional().describe('The labels of the slices.'),
  series: ChartData.optional().describe('The values of the slices.'),
  threeDimensional: z.boolean().optional().describe('True if the pie is three dimensional.'),
  pieHole: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The size of the hole in the pie, from 0 to 1, making it a doughnut chart.'),
});

export type PieChartSpec = z.infer<typeof PieChartSpec>;
