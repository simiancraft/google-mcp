import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The ID for `update_protected_range` and `delete_protected_range` comes
 * back in the reply; existing protections are not listed by
 * `get_spreadsheet` (its projection is metadata-only; protected ranges ride
 * the sheet payload, tracked with grid data in issue #28), so keep the
 * returned ID. The REST entity's tableId backing is not carried (tables are
 * not part of this surface).
 */
export const add_protected_range = sheetsOperation({
  description:
    'Protect a range, a named range, or a whole sheet so only the listed editors can change it, or (with warningOnly) so every edit prompts a confirmation warning; returns the protected range with its assigned ID.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddProtectedRangeRequest',
  schema,
  handler,
});
