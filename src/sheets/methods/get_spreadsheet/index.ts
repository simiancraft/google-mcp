import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The projection carries identity, spreadsheet properties, per-sheet
 * properties, and each sheet's reactive collections: the basic filter,
 * filter views (with stable IDs), protected ranges (IDs always, editor lists
 * where the caller can see them), conditional format rules (in order; the
 * array position is the rule index), banded ranges (with IDs or references),
 * ordered row and column groups (updates select by range plus depth; deletes
 * take a range), slicers (with stable IDs), and merged ranges. Grid data
 * (per-cell formatting, validation, notes) is not exposed (issue #28). Cell
 * values are read with the values operations.
 */
export const get_spreadsheet = sheetsOperation({
  description:
    "Get a spreadsheet by id: its properties (title, locale, time zone), the properties of every sheet (tab), and each sheet's basic filter, filter views (with IDs), protected ranges (with IDs; editor lists where the caller has edit access), conditional format rules in index order, banded ranges (with IDs or references), ordered row and column groups, slicers (with IDs), and merged ranges; the discovery read for filter, rule, protection, banding, grouping, slicer, and merge operations. Cell values are read with the values operations.",
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
