import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';

const ColumnStyle = z.strictObject({
  colorStyle: ColorStyle.optional().describe('The color of these columns.'),
  label: z.string().optional().describe("The label of these columns' legend entry."),
});

/**
 * A chart that shows how sequential positive and negative values contribute to
 * a running total, with optional custom subtotals.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#WaterfallChartSpec
 */
export const WaterfallChartSpec = z.strictObject({
  domain: z
    .strictObject({
      data: ChartData.describe('The horizontal-axis data.'),
      reversed: z.boolean().optional().describe('True to reverse the horizontal-axis value order.'),
    })
    .describe('The horizontal-axis domain for the waterfall chart.'),
  series: z
    .array(
      z.strictObject({
        data: ChartData.describe('The data visualized in this series.'),
        positiveColumnsStyle: ColumnStyle.optional().describe('Style for positive columns.'),
        negativeColumnsStyle: ColumnStyle.optional().describe('Style for negative columns.'),
        subtotalColumnsStyle: ColumnStyle.optional().describe('Style for subtotal columns.'),
        hideTrailingSubtotal: z
          .boolean()
          .optional()
          .describe('True to hide the subtotal column at the end of this series.'),
        customSubtotals: z
          .array(
            z.strictObject({
              subtotalIndex: z
                .number()
                .int()
                .min(0)
                .describe('The zero-based data-point index associated with this subtotal.'),
              label: z.string().optional().describe('The subtotal column label.'),
              dataIsSubtotal: z
                .boolean()
                .optional()
                .describe(
                  'True when the indexed point is already the subtotal; false places a computed subtotal after it.',
                ),
            }),
          )
          .optional()
          .describe('Custom subtotal columns for this series.'),
      }),
    )
    .min(1)
    .describe('The data series visualized by the waterfall chart.'),
  stackedType: z
    .enum(['STACKED', 'SEQUENTIAL'])
    .optional()
    .describe('Whether corresponding values stack or series spread sequentially.'),
  firstValueIsTotal: z
    .boolean()
    .optional()
    .describe('True to interpret the first value as a total.'),
  hideConnectorLines: z
    .boolean()
    .optional()
    .describe('True to hide connector lines between columns.'),
});

export type WaterfallChartSpec = z.infer<typeof WaterfallChartSpec>;
