import { z } from 'zod';
import { TableCellLocation } from './TableCellLocation.js';

/**
 * A reference to a subset of a table: a starting cell plus row and column
 * spans. The cells specified by a table range do not necessarily form a
 * rectangle — a span that crosses merged cells covers whatever those cells
 * span.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableRange
 */
export const TableRange = z.strictObject({
  tableCellLocation: TableCellLocation.describe('The cell location where the table range starts.'),
  rowSpan: z.number().int().min(1).describe('The row span of the table range.'),
  columnSpan: z.number().int().min(1).describe('The column span of the table range.'),
});

export type TableRange = z.infer<typeof TableRange>;
