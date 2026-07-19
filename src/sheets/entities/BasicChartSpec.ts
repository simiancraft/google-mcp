import { z } from 'zod';
import { ChartData } from './ChartData.js';

/**
 * A basic chart: bar, line, area, column, scatter, combo, or stepped area. A
 * curated projection of the REST `BasicChartSpec` (stacking, line smoothing,
 * three-dimensional, and interpolation options are not carried).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#BasicChartSpec
 */
export const BasicChartSpec = z.strictObject({
  chartType: z
    .enum(['BAR', 'LINE', 'AREA', 'COLUMN', 'SCATTER', 'COMBO', 'STEPPED_AREA'])
    .describe('The type of the chart.'),
  legendPosition: z
    .enum(['BOTTOM_LEGEND', 'LEFT_LEGEND', 'RIGHT_LEGEND', 'TOP_LEGEND', 'NO_LEGEND'])
    .optional()
    .describe('Where the legend renders.'),
  axis: z
    .array(
      z.strictObject({
        position: z
          .enum(['BOTTOM_AXIS', 'LEFT_AXIS', 'RIGHT_AXIS'])
          .describe('The position of this axis.'),
        title: z.string().optional().describe('The title of this axis.'),
      }),
    )
    .optional()
    .describe('The axes of the chart.'),
  domains: z
    .array(
      z.strictObject({
        domain: ChartData.describe(
          'The data of the domain: the horizontal axis, such as the column of dates.',
        ),
      }),
    )
    .max(1)
    .optional()
    .describe('The domain of the chart; only one is supported.'),
  series: z
    .array(
      z.strictObject({
        series: ChartData.describe('The data being visualized in this series.'),
        targetAxis: z
          .enum(['LEFT_AXIS', 'RIGHT_AXIS'])
          .optional()
          .describe('The axis this series charts against.'),
        type: z
          .enum(['BAR', 'LINE', 'AREA', 'COLUMN', 'SCATTER', 'STEPPED_AREA'])
          .optional()
          .describe('The type of this series, for COMBO charts only.'),
      }),
    )
    .describe('The data this chart visualizes, one entry per series.'),
  headerCount: z
    .number()
    .int()
    .optional()
    .describe(
      'The number of rows or columns in the data that are headers; omitted, Google guesses.',
    ),
});

export type BasicChartSpec = z.infer<typeof BasicChartSpec>;
