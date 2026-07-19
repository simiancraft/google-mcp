import { z } from 'zod';
import { ChartData } from './ChartData.js';

const CandlestickSeries = z.strictObject({
  data: ChartData.describe('The data of this candlestick series.'),
});

/**
 * A chart that displays low, open, close, and high values for a data series.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#CandlestickChartSpec
 */
export const CandlestickChartSpec = z.strictObject({
  domain: z
    .strictObject({
      data: ChartData.describe('The horizontal-axis data for the candles.'),
      reversed: z.boolean().optional().describe('True to reverse the horizontal-axis value order.'),
    })
    .describe('The horizontal-axis domain for the candlestick chart.'),
  data: z
    .array(
      z.strictObject({
        lowSeries: CandlestickSeries.describe('The low value for each candle.'),
        openSeries: CandlestickSeries.describe('The open value for each candle.'),
        closeSeries: CandlestickSeries.describe('The close value for each candle.'),
        highSeries: CandlestickSeries.describe('The high value for each candle.'),
      }),
    )
    .length(1)
    .describe('The low, open, close, and high data; Google supports exactly one entry.'),
});

export type CandlestickChartSpec = z.infer<typeof CandlestickChartSpec>;
