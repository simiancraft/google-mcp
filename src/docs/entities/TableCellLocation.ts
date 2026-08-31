import { z } from 'zod';
import { Location } from './Location.js';

/**
 * Location of a single cell within a table: the table's start location plus
 * the cell's zero-based row and column indices.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#TableCellLocation
 */
export const TableCellLocation = z.strictObject({
  tableStartLocation: Location.describe(
    "The location where the table starts in the document: the table structural element's startIndex from get_document.",
  ),
  rowIndex: z
    .number()
    .int()
    .min(0)
    .describe(
      'The zero-based row index. For example, the second row in the table has a row index of 1.',
    ),
  columnIndex: z
    .number()
    .int()
    .min(0)
    .describe(
      'The zero-based column index. For example, the second column in the table has a column index of 1.',
    ),
});

export type TableCellLocation = z.infer<typeof TableCellLocation>;
