import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The projection carries identity, spreadsheet properties, per-sheet
 * properties, and each sheet's reactive collections: protected ranges (IDs
 * always, editor lists where the caller can see them), conditional format
 * rules (in order; the array position is the rule index), and merged
 * ranges. Grid data
 * (per-cell formatting, validation, notes) is not exposed (issue #28). Cell
 * contents are read with the values operations.
 */
export const get_spreadsheet = sheetsOperation({
  description:
    "Get a spreadsheet by id: its properties (title, locale, time zone), the properties of every sheet (tab), and each sheet's protected ranges (with IDs; editor lists where the caller has edit access), conditional format rules in index order, and merged ranges; the discovery read for the rule, protection, and merge operations. Cell values are read with the values operations.",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/get',
  schema,
  handler,
});
