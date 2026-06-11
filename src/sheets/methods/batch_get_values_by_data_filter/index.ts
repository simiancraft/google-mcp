import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const batch_get_values_by_data_filter = sheetsOperation({
  description:
    'Read the ranges of values matched by data filters (A1 ranges, grid ranges, or developer-metadata lookups), with the filters that matched each range.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter',
  schema,
  handler,
});
