import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The REST request takes a field mask; here the mask is derived from the
 * properties actually provided, so an untouched property can never be reset
 * by a too-wide mask.
 */
export const update_spreadsheet_properties = sheetsOperation({
  description:
    "Update a spreadsheet's own properties: its title, locale, time zone, or recalculation cadence; only the properties provided change.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateSpreadsheetPropertiesRequest',
  schema,
  handler,
});
