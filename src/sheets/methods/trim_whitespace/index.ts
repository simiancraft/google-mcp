import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const trim_whitespace = sheetsOperation({
  description:
    'Trim spaces, tabs, and newlines from cells in a range and return the number of cells changed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#TrimWhitespaceRequest',
  schema,
  handler,
});
