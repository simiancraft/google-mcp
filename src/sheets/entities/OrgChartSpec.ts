import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';

/**
 * A hierarchy chart whose unique node labels can point to parent labels and
 * optional tooltips.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#OrgChartSpec
 */
export const OrgChartSpec = z.strictObject({
  nodeSize: z
    .enum(['SMALL', 'MEDIUM', 'LARGE'])
    .optional()
    .describe('The size of the org chart nodes.'),
  nodeColorStyle: ColorStyle.optional().describe('The color of unselected nodes.'),
  selectedNodeColorStyle: ColorStyle.optional().describe('The color of selected nodes.'),
  labels: ChartData.describe('The unique labels for every node in the chart.'),
  parentLabels: ChartData.optional().describe(
    'The parent label for each node; a blank value marks a top-level node.',
  ),
  tooltips: ChartData.optional().describe('The optional tooltip for each corresponding node.'),
});

export type OrgChartSpec = z.infer<typeof OrgChartSpec>;
