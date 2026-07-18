import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * No field mask on this request: the provided spec replaces the whole
 * existing one, so partial edits must resend the complete chart.
 */
export const update_chart_spec = sheetsOperation({
  description:
    "Replace a chart's specification: its title, type, data ranges, axes, and legend; the chart keeps its ID and position.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateChartSpecRequest',
  schema,
  handler,
});
