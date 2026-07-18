import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The REST request repeats one `CellData` over a range behind a field mask;
 * here the cell is format-only and the mask is derived from the format fields
 * actually provided (per-subkey for textFormat), so values are never
 * overwritten and an untouched format field is never reset.
 */
export const repeat_cell = sheetsOperation({
  description:
    'Apply a cell format (number, currency, or percent rendering, fill color, text format, alignment, wrap) to every cell in a range; values are untouched and only the format fields provided change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#RepeatCellRequest',
  schema,
  handler,
});
