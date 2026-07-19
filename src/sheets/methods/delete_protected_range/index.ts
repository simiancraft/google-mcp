import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Removes the protection, not the data: the cells and their values are
 * untouched. Whether they become editable depends on what else applies
 * (document permissions, overlapping protected ranges).
 */
export const delete_protected_range = sheetsOperation({
  description:
    'Delete a protected range by ID, removing that protection from its cells; the cell values are untouched, and any overlapping protection or document permission still applies.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteProtectedRangeRequest',
  schema,
  handler,
});
