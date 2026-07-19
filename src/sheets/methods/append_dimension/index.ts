import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const append_dimension = sheetsOperation({
  description:
    'Append empty rows or columns to the end of a sheet, increasing its grid size without changing existing cells; repeating the call appends another set.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AppendDimensionRequest',
  schema,
  handler,
});
