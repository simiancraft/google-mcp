import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The mask is derived from the fields actually provided, so an untouched
 * property (the description, the editor list) is never reset by a too-wide
 * mask, and an empty update is refused rather than sent.
 */
export const update_protected_range = sheetsOperation({
  description:
    'Update a protected range by ID: move it, redescribe it, switch it between warning-only and editor-restricted, or change its editors and unprotected ranges; only the fields provided change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateProtectedRangeRequest',
  schema,
  handler,
});
