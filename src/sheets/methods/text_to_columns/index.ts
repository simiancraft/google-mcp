import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const text_to_columns = sheetsOperation({
  description:
    'Split each cell in a one-column source range into columns using a standard, custom, or autodetected delimiter; output can overwrite adjacent cells.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#TextToColumnsRequest',
  schema,
  handler,
});
