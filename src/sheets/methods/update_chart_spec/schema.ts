import { z } from 'zod';
import { ChartSpec } from '../../entities/ChartSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the chart.'),
    chartId: z.number().int().describe('The ID of the chart to update.'),
    spec: ChartSpec.describe(
      'The complete specification to apply. This request replaces the whole existing spec rather than masking fields, so provide exactly one ordinary-grid chart family and every field that should remain. Data-source-only and deferred data-label fields are lost on update.',
    ),
  }),
  /** The update reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    chartId: z.number().int().describe('The ID of the updated chart.'),
  }),
};
