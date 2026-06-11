import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Destructive: cleared values are unrecoverable through the API. Formatting,
 * data validation, and the cells themselves are kept; only values go.
 */
export const clear_values = sheetsOperation({
  description:
    'Clear the values in a range, irreversibly; formatting and data validation are kept.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/clear',
  schema,
  handler,
});
