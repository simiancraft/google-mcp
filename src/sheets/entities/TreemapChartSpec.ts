import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';
import { TextFormat } from './TextFormat.js';

const TreemapTextFormat = TextFormat.omit({ link: true });

/**
 * A chart that renders hierarchical labels as nested cells sized and colored
 * by numeric data.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#TreemapChartSpec
 */
export const TreemapChartSpec = z.strictObject({
  labels: ChartData.describe('The labels for the treemap cells.'),
  parentLabels: ChartData.describe('The parent label for each treemap cell.'),
  sizeData: ChartData.describe('The numeric data that sizes each treemap cell.'),
  colorData: ChartData.optional().describe(
    'The numeric data that colors each cell; omitted, sizeData supplies color values.',
  ),
  textFormat: TreemapTextFormat.optional().describe(
    'The label text format; links are not supported.',
  ),
  levels: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The number of interactive labeled data levels to show.'),
  hintedLevels: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Additional unlabeled, non-interactive data levels to show.'),
  minValue: z.number().optional().describe('The minimum value used by the color scale.'),
  maxValue: z.number().optional().describe('The maximum value used by the color scale.'),
  headerColorStyle: ColorStyle.optional().describe('The background color of header cells.'),
  colorScale: z
    .strictObject({
      minValueColorStyle: ColorStyle.optional().describe('The color at the minimum value.'),
      midValueColorStyle: ColorStyle.optional().describe('The color at the scale midpoint.'),
      maxValueColorStyle: ColorStyle.optional().describe('The color at the maximum value.'),
      noDataColorStyle: ColorStyle.optional().describe(
        'The color for missing or non-numeric data.',
      ),
    })
    .optional()
    .describe('The color gradient for treemap cells.'),
  hideTooltips: z.boolean().optional().describe('True to hide treemap tooltips.'),
});

export type TreemapChartSpec = z.infer<typeof TreemapChartSpec>;
