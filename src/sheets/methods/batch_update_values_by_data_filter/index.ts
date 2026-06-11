import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const batch_update_values_by_data_filter = sheetsOperation({
  description:
    'Write values into the ranges matched by data filters; when a filter matches multiple ranges, the values apply to all of them.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdateByDataFilter',
  schema,
  handler,
});
