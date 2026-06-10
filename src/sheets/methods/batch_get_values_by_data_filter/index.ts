import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter */
export const batch_get_values_by_data_filter = sheetsOperation({
  description:
    'Read the ranges of values matched by data filters (A1 ranges, grid ranges, or developer-metadata lookups), with the filters that matched each range.',
  schema,
  handler,
});
