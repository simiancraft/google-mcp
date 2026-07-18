import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Deleting a sheet discards its cells with it, and the Sheets API has no
 * trash: the only recovery is Drive revision history.
 */
export const delete_sheet = sheetsOperation({
  description:
    'Permanently delete a sheet (tab) and all of its data from a spreadsheet; refused if it is the last visible sheet.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteSheetRequest',
  schema,
  handler,
});
