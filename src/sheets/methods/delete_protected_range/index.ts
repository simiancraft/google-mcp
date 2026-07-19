import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Removes the protection, not the data: the cells and their values are
 * untouched, they just become editable again.
 */
export const delete_protected_range = sheetsOperation({
  description:
    'Delete a protected range by ID, making its cells editable again; the cell values are untouched.',
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
