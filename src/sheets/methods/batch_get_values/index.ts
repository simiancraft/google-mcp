import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGet */
export const batch_get_values = sheetsOperation({
  description:
    'Read multiple ranges of values from a spreadsheet in one call; results come back in request order.',
  schema,
  handler,
});
