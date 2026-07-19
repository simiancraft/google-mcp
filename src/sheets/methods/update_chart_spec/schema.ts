import { z } from 'zod';
import { ChartSpec } from '../../entities/ChartSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the chart.'),
    chartId: z.number().int().describe('The ID of the chart to update.'),
    spec: ChartSpec.describe(
      'The specification to apply; it replaces the whole existing spec, so provide the complete chart, with exactly one of basicChart or pieChart. A chart with features this spec cannot express (specialty types, stacking, styling) loses them on update.',
    ),
  }),
  /** The update reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    chartId: z.number().int().describe('The ID of the updated chart.'),
  }),
};
