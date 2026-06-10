import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.sheets/copyTo
 *
 * Returns the properties of the newly created sheet; in the destination its
 * title arrives as "Copy of <source title>".
 */
export const copy_sheet = sheetsOperation({
  description:
    'Copy a single sheet (tab) from a spreadsheet to another spreadsheet (or the same one); returns the new sheet’s properties.',
  schema,
  handler,
});
