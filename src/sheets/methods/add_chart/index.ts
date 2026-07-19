import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * ChartSpec carries every ordinary-grid chart family; the reply's chart ID
 * feeds update_chart_spec and delete_embedded_object.
 */
export const add_chart = sheetsOperation({
  description:
    'Add a chart to a spreadsheet, floating over the grid or on its own sheet; the chart renders in the UI and in xlsx and pdf exports, and the returned ID addresses later spec updates and deletion.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddChartRequest',
  schema,
  handler,
});
