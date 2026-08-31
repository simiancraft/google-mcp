import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';

/**
 * A border around a table cell: color, width in points, and dash style.
 * Table cell borders cannot be transparent; to hide one, make its width 0.
 * The width rides the fontSize precedent: a plain number of points here, a
 * PT Dimension on the wire.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableCellBorder
 */
export const TableCellBorder = z.strictObject({
  color: OptionalColor.optional().describe(
    'The color of the border. This color cannot be transparent.',
  ),
  width: z
    .number()
    .min(0)
    .optional()
    .describe('The width of the border, in points; a width of 0 hides the border.'),
  dashStyle: z.enum(['SOLID', 'DOT', 'DASH']).optional().describe('The dash style of the border.'),
});

export type TableCellBorder = z.infer<typeof TableCellBorder>;
