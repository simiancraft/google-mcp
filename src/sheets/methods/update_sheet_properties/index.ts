import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The REST request takes a field mask; here the mask is derived from the
 * properties actually provided (per-subkey for gridProperties), so an
 * untouched property can never be reset by a too-wide mask. Destructive,
 * unlike the suite's other property updates: shrinking gridProperties'
 * rowCount or columnCount truncates the grid and discards the cells beyond
 * the new bounds.
 */
export const update_sheet_properties = sheetsOperation({
  description:
    "Update a sheet (tab)'s properties: rename it, move it, hide or show it, color its tab, or resize and freeze its grid; only the properties provided change. Shrinking rowCount or columnCount permanently discards the cells beyond the new bounds.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateSheetPropertiesRequest',
  schema,
  handler,
});
