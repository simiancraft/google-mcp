import { z } from 'zod';
import { ChartSpec } from '../../entities/ChartSpec.js';
import { EmbeddedObjectPosition } from '../../entities/EmbeddedObjectPosition.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to add the chart to.'),
    spec: ChartSpec.describe(
      'What the chart shows; provide exactly one of basicChart or pieChart.',
    ),
    position: EmbeddedObjectPosition.describe(
      'Where the chart lives: an overlayPosition floating over the grid, or newSheet: true for its own sheet.',
    ),
  }),
  /** The chart renders in the UI and in xlsx and pdf exports; the reply's chart is projected to its ids. */
  output: z.object({
    chartId: z
      .number()
      .int()
      .describe('The ID of the new chart, used by update_chart_spec and delete_embedded_object.'),
    sheetId: z
      .number()
      .int()
      .optional()
      .describe('The sheet the chart was placed on, when positioned on its own new sheet.'),
  }),
};
