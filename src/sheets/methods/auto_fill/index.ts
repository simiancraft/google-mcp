import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const auto_fill = sheetsOperation({
  description:
    'Extend detected source data through a range or an explicit source-and-destination area; generated values overwrite the destination cells.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AutoFillRequest',
  schema,
  handler,
});
