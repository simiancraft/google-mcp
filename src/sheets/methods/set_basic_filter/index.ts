import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const set_basic_filter = sheetsOperation({
  description:
    'Set the basic filter on a sheet range, including optional row visibility criteria and sort specifications; get_spreadsheet reads it back as basicFilter.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#SetBasicFilterRequest',
  schema,
  handler,
});
