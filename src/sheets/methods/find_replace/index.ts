import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Like update_values, replacement overwrites with explicitly provided content. */
export const find_replace = sheetsOperation({
  description:
    'Find and replace text over exactly one range, sheet, or whole spreadsheet, optionally including formula source; returns changed cell, row, sheet, and occurrence counts.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#FindReplaceRequest',
  schema,
  handler,
});
