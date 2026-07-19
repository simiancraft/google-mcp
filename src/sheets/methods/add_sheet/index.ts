import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The direct tab-creation path (`copy_sheet` can only produce "Copy of X");
 * the sheet ID is assigned by Google and returned in the properties.
 */
export const add_sheet = sheetsOperation({
  description:
    'Add a new sheet (tab) to a spreadsheet, optionally naming, positioning, coloring, and sizing it; returns the properties of the new sheet.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddSheetRequest',
  schema,
  handler,
});
