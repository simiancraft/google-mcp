import { z } from 'zod';
import { ColorStyle } from './ColorStyle.js';
import { NumberFormat } from './NumberFormat.js';
import { TextFormat } from './TextFormat.js';

/**
 * A cell's format. A curated projection of the REST `CellFormat`: number
 * format, fill, text format, alignment, and wrap; borders travel through
 * `update_borders`, and padding, rotation, direction, and hyperlink display
 * are not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#CellFormat
 */
export const CellFormat = z.strictObject({
  numberFormat: NumberFormat.optional().describe(
    'How the cell value renders as a number, date, currency, or percent.',
  ),
  backgroundColorStyle: ColorStyle.optional().describe('The background color of the cell.'),
  textFormat: TextFormat.optional().describe(
    "The format of the cell's text; only the subfields provided are updated.",
  ),
  horizontalAlignment: z
    .enum(['LEFT', 'CENTER', 'RIGHT'])
    .optional()
    .describe('The horizontal alignment of the value in the cell.'),
  verticalAlignment: z
    .enum(['TOP', 'MIDDLE', 'BOTTOM'])
    .optional()
    .describe('The vertical alignment of the value in the cell.'),
  wrapStrategy: z
    .enum(['OVERFLOW_CELL', 'LEGACY_WRAP', 'CLIP', 'WRAP'])
    .optional()
    .describe('How the value in the cell wraps.'),
});

export type CellFormat = z.infer<typeof CellFormat>;
