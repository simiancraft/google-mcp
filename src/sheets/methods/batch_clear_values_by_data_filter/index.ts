import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchClearByDataFilter
 *
 * Destructive: cleared values are unrecoverable through the API. Formatting,
 * data validation, and the cells themselves are kept; only values go.
 */
export const batch_clear_values_by_data_filter = sheetsOperation({
  description:
    'Clear the values in every range matched by data filters, irreversibly; formatting and data validation are kept.',
  schema,
  handler,
  destructive: true,
});
