import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update */
export const update_values = sheetsOperation({
  description:
    'Write a 2D array of values into a range, overwriting what is there; valueInputOption controls whether values are stored raw or parsed as if typed.',
  schema,
  handler,
});
