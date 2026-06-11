import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/create
 *
 * The new spreadsheet lands in the account's Drive root. The Sheets API has no
 * delete: removing a spreadsheet is Drive's `files.delete`, outside this
 * server's surface.
 */
export const create_spreadsheet = sheetsOperation({
  description:
    'Create a spreadsheet with a title and optionally named sheets (tabs); returns the new spreadsheet and its id.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  schema,
  handler,
});
