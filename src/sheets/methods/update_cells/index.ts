import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The general form of `repeat_cell`: per-cell values, notes, formats, and
 * rich text runs in one write. The mask is the union of the fields the
 * provided cells carry, and it applies to every written cell, so a masked
 * field a cell omits is cleared in that cell (and, in range mode, in the
 * uncovered remainder of the range); destructive for that reason. Pivot
 * tables, chip runs, and data-source fields are not carried (issue #77).
 */
export const update_cells = sheetsOperation({
  description:
    'Write cell content (values, notes, formats, rich text runs with per-run color, emphasis, or hyperlinks) cell by cell from a start coordinate or over a range; the written fields are the union of what the cells provide, and a written field a cell omits is cleared in that cell, as is the uncovered remainder of an explicit range.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateCellsRequest',
  schema,
  handler,
});
