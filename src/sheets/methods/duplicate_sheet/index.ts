import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The same-spreadsheet counterpart of `copy_sheet`, and the one that can name
 * and position the result instead of yielding "Copy of X".
 */
export const duplicate_sheet = sheetsOperation({
  description:
    'Duplicate a sheet (tab) within its spreadsheet, optionally naming and positioning the duplicate; returns the properties of the new sheet.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DuplicateSheetRequest',
  schema,
  handler,
});
