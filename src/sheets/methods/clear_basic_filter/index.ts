import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const clear_basic_filter = sheetsOperation({
  description: 'Remove the basic filter from a sheet, if one exists.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#ClearBasicFilterRequest',
  schema,
  handler,
});
