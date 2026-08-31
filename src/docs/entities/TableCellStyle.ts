import { z } from 'zod';
import { OptionalColor } from './OptionalColor.js';
import { TableCellBorder } from './TableCellBorder.js';

/**
 * The cell styling an agent can set on table cells: a curated projection of
 * the REST TableCellStyle (the read-only rowSpan and columnSpan are
 * excluded; they are reported by merges, not set). Paddings ride the
 * fontSize precedent: plain numbers of points here, PT Dimensions on the
 * wire. Omitting a field leaves the existing style untouched, because the
 * update's field mask is derived from the keys provided.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableCellStyle
 */
export const TableCellStyle = z.strictObject({
  backgroundColor: OptionalColor.optional().describe('The background color of the cell.'),
  borderTop: TableCellBorder.optional().describe('The top border of the cell.'),
  borderBottom: TableCellBorder.optional().describe('The bottom border of the cell.'),
  borderLeft: TableCellBorder.optional().describe('The left border of the cell.'),
  borderRight: TableCellBorder.optional().describe('The right border of the cell.'),
  paddingTop: z.number().min(0).optional().describe('The top padding of the cell, in points.'),
  paddingBottom: z
    .number()
    .min(0)
    .optional()
    .describe('The bottom padding of the cell, in points.'),
  paddingLeft: z.number().min(0).optional().describe('The left padding of the cell, in points.'),
  paddingRight: z.number().min(0).optional().describe('The right padding of the cell, in points.'),
  contentAlignment: z
    .enum(['TOP', 'MIDDLE', 'BOTTOM'])
    .optional()
    .describe(
      'The alignment of the content in the table cell. The default alignment matches the alignment for newly created table cells in the Docs editor.',
    ),
});

export type TableCellStyle = z.infer<typeof TableCellStyle>;
