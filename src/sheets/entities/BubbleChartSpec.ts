import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';
import { TextFormat } from './TextFormat.js';

const BubbleTextFormat = TextFormat.omit({ strikethrough: true, underline: true, link: true });

/**
 * A chart that positions bubbles by x and y values and can vary their size and
 * color grouping.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#BubbleChartSpec
 */
export const BubbleChartSpec = z.strictObject({
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
    .describe('Where the legend is drawn.'),
  bubbleLabels: ChartData.optional().describe('The labels displayed inside the bubbles.'),
  domain: ChartData.describe('The x-values that position the bubbles horizontally.'),
  series: ChartData.describe('The y-values that position the bubbles vertically.'),
  groupIds: ChartData.optional().describe('The group IDs used to color related bubbles alike.'),
  bubbleSizes: ChartData.optional().describe(
    'The relative bubble sizes; groupIds is required when this field is provided.',
  ),
  bubbleOpacity: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('The bubble opacity from 0, transparent, through 1, opaque.'),
  bubbleBorderColorStyle: ColorStyle.optional().describe('The bubble border color.'),
  bubbleMaxRadiusSize: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('The maximum bubble radius in pixels.'),
  bubbleMinRadiusSize: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('The minimum bubble radius in pixels.'),
  bubbleTextStyle: BubbleTextFormat.optional().describe(
    'The text format inside bubbles; strikethrough, underline, and links are not supported.',
  ),
});

export type BubbleChartSpec = z.infer<typeof BubbleChartSpec>;
