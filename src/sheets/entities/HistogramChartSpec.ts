import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';

/**
 * A chart that groups numeric data into buckets and renders each bucket as a
 * column of stacked items.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#HistogramChartSpec
 */
export const HistogramChartSpec = z.strictObject({
  series: z
    .array(
      z.strictObject({
        barColorStyle: ColorStyle.optional().describe(
          'The color of the column representing this series in each bucket.',
        ),
        data: ChartData.describe('The data for this histogram series.'),
      }),
    )
    .min(1)
    .describe('The series whose values are grouped into buckets.'),
  legendPosition: z
    .enum([
      'BOTTOM_LEGEND',
      'LEFT_LEGEND',
      'RIGHT_LEGEND',
      'TOP_LEGEND',
      'NO_LEGEND',
      'INSIDE_LEGEND',
    ])
    .optional()
    .describe('The position of the chart legend.'),
  showItemDividers: z
    .boolean()
    .optional()
    .describe('Whether horizontal divider lines appear between items in each column.'),
  bucketSize: z
    .number()
    .min(0)
    .optional()
    .describe('The bucket width; omitted, Google chooses it automatically.'),
  outlierPercentile: z
    .number()
    .min(0)
    .max(0.5)
    .optional()
    .describe('The top and bottom percentile excluded when calculating bucket sizes.'),
});

export type HistogramChartSpec = z.infer<typeof HistogramChartSpec>;
