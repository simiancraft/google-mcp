import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const batch_get_values = sheetsOperation({
  description:
    'Read multiple ranges of values from a spreadsheet in one call; results come back in request order.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGet',
  schema,
  handler,
});
