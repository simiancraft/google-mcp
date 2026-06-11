import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const update_values = sheetsOperation({
  description:
    'Write a 2D array of values into a range, overwriting what is there; valueInputOption controls whether values are stored raw or parsed as if typed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update',
  schema,
  handler,
});
