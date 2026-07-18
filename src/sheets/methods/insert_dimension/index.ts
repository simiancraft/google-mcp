import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const insert_dimension = sheetsOperation({
  description:
    'Insert empty rows or columns into a sheet at a position, shifting existing ones over; formulas and formats adjust as if inserted in the UI.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#InsertDimensionRequest',
  schema,
  handler,
});
