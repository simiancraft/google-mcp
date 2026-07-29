import { z } from 'zod';
import { BasicChartSpec } from './BasicChartSpec.js';
import { BubbleChartSpec } from './BubbleChartSpec.js';
import { CandlestickChartSpec } from './CandlestickChartSpec.js';
import { ColorStyle } from './ColorStyle.js';
import { HistogramChartSpec } from './HistogramChartSpec.js';
import { OrgChartSpec } from './OrgChartSpec.js';
import { PieChartSpec } from './PieChartSpec.js';
import { ScorecardChartSpec } from './ScorecardChartSpec.js';
import { TextFormat } from './TextFormat.js';
import { TextPosition } from './TextPosition.js';
import { TreemapChartSpec } from './TreemapChartSpec.js';
import { WaterfallChartSpec } from './WaterfallChartSpec.js';

const ChartTextFormat = TextFormat.omit({ strikethrough: true, underline: true, link: true });

/**
 * What a chart shows: common chart presentation plus exactly one chart-family
 * spec. Carries every ordinary-grid chart family; data-source chart fields are
 * outside this surface. The maximized and backgroundColorStyle fields do not
 * apply to org charts.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ChartSpec
 */
export const ChartSpec = z.strictObject({
  title: z.string().optional().describe('The title of the chart.'),
  altText: z
    .string()
    .optional()
    .describe('Alternative text that describes the chart for accessibility.'),
  titleTextFormat: ChartTextFormat.optional().describe(
    'The title text format; strikethrough, underline, and links are not supported.',
  ),
  titleTextPosition: TextPosition.optional().describe('The title text position.'),
  subtitle: z.string().optional().describe('The subtitle of the chart.'),
  subtitleTextFormat: ChartTextFormat.optional().describe(
    'The subtitle text format; strikethrough, underline, and links are not supported.',
  ),
  subtitleTextPosition: TextPosition.optional().describe('The subtitle text position.'),
  fontName: z.string().optional().describe('The default font for chart text.'),
  maximized: z
    .boolean()
    .optional()
    .describe('True to fill the rendered area with minimum padding; does not apply to org charts.'),
  backgroundColorStyle: ColorStyle.optional().describe(
    'The background color of the chart; does not apply to org charts.',
  ),
  hiddenDimensionStrategy: z
    .enum(['SKIP_HIDDEN_ROWS_AND_COLUMNS', 'SKIP_HIDDEN_ROWS', 'SKIP_HIDDEN_COLUMNS', 'SHOW_ALL'])
    .optional()
    .describe('How hidden source rows and columns are handled.'),
  basicChart: BasicChartSpec.optional().describe(
    'A bar, line, area, column, scatter, combo, or stepped-area chart.',
  ),
  pieChart: PieChartSpec.optional().describe('A pie chart.'),
  bubbleChart: BubbleChartSpec.optional().describe('A bubble chart.'),
  candlestickChart: CandlestickChartSpec.optional().describe('A candlestick chart.'),
  orgChart: OrgChartSpec.optional().describe('An organization chart.'),
  histogramChart: HistogramChartSpec.optional().describe('A histogram chart.'),
  waterfallChart: WaterfallChartSpec.optional().describe('A waterfall chart.'),
  treemapChart: TreemapChartSpec.optional().describe('A treemap chart.'),
  scorecardChart: ScorecardChartSpec.optional().describe('A scorecard chart.'),
});

export type ChartSpec = z.infer<typeof ChartSpec>;
