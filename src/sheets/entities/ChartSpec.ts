import { z } from 'zod';
import { BasicChartSpec } from './BasicChartSpec.js';
import { PieChartSpec } from './PieChartSpec.js';

/**
 * What a chart shows: a title plus exactly one chart-type spec. A curated
 * projection of the REST `ChartSpec`: the basic family and pie are carried;
 * the specialty types (bubble, candlestick, org, histogram, waterfall,
 * treemap, scorecard) and the styling fields are not.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ChartSpec
 */
export const ChartSpec = z.strictObject({
  title: z.string().optional().describe('The title of the chart.'),
  subtitle: z.string().optional().describe('The subtitle of the chart.'),
  basicChart: BasicChartSpec.optional().describe(
    'A bar, line, area, column, scatter, combo, or stepped-area chart.',
  ),
  pieChart: PieChartSpec.optional().describe('A pie chart.'),
});

export type ChartSpec = z.infer<typeof ChartSpec>;
