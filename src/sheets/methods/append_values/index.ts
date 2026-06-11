import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append
 *
 * The range is where the API searches for an existing table, not where the
 * data lands: values are appended to the first row after that table.
 */
export const append_values = sheetsOperation({
  description:
    'Append rows of values after the logical table found at a range; the range is searched for a table, and the data lands after its last row.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
