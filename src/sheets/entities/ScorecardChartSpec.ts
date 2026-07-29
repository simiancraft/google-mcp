import { z } from 'zod';
import { ChartData } from './ChartData.js';
import { ColorStyle } from './ColorStyle.js';
import { TextFormat } from './TextFormat.js';
import { TextPosition } from './TextPosition.js';

const ScorecardTextFormat = TextFormat.omit({ link: true });

/**
 * A chart that highlights one key performance indicator and can compare it to
 * a baseline value.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ScorecardChartSpec
 */
export const ScorecardChartSpec = z.strictObject({
  keyValueData: ChartData.describe('The data for the scorecard key value.'),
  baselineValueData: ChartData.optional().describe('The optional comparison baseline data.'),
  aggregateType: z
    .enum(['AVERAGE', 'COUNT', 'MAX', 'MEDIAN', 'MIN', 'SUM'])
    .optional()
    .describe('The aggregation applied to ordinary-grid key and baseline data.'),
  keyValueFormat: z
    .strictObject({
      textFormat: ScorecardTextFormat.optional().describe(
        'Text formatting for the key value; links are not supported.',
      ),
      position: TextPosition.optional().describe('The horizontal position of the key value.'),
    })
    .optional()
    .describe('Formatting options for the key value.'),
  baselineValueFormat: z
    .strictObject({
      comparisonType: z
        .enum(['ABSOLUTE_DIFFERENCE', 'PERCENTAGE_DIFFERENCE'])
        .optional()
        .describe('How the key value is compared with the baseline value.'),
      textFormat: ScorecardTextFormat.optional().describe(
        'Text formatting for the baseline value; links are not supported.',
      ),
      position: TextPosition.optional().describe('The horizontal position of the baseline value.'),
      description: z.string().optional().describe('Text appended after the baseline value.'),
      positiveColorStyle: ColorStyle.optional().describe(
        'The color used when the baseline represents a positive change.',
      ),
      negativeColorStyle: ColorStyle.optional().describe(
        'The color used when the baseline represents a negative change.',
      ),
    })
    .optional()
    .describe('Formatting options for the baseline value.'),
  scaleFactor: z
    .number()
    .optional()
    .describe('The factor used to scale the displayed key and baseline values.'),
  numberFormatSource: z
    .enum(['FROM_DATA', 'CUSTOM'])
    .optional()
    .describe('Whether number formatting comes from the data or custom options.'),
  customFormatOptions: z
    .strictObject({
      prefix: z.string().optional().describe('Text prepended to the displayed value.'),
      suffix: z.string().optional().describe('Text appended to the displayed value.'),
    })
    .optional()
    .describe('Custom number formatting used when numberFormatSource is CUSTOM.'),
});

export type ScorecardChartSpec = z.infer<typeof ScorecardChartSpec>;
