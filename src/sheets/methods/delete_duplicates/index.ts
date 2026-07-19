import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_duplicates = sheetsOperation({
  description:
    'Remove duplicate rows from a range, keeping the first occurrence and optionally comparing only selected columns; hidden duplicate rows are removed too.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteDuplicatesRequest',
  schema,
  handler,
});
