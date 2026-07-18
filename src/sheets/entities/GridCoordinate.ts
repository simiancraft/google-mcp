import { z } from 'zod';

/**
 * One cell, addressed by sheet id and zero-based row and column indexes.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#GridCoordinate
 */
export const GridCoordinate = z.strictObject({
  sheetId: z.number().int().describe('The sheet this coordinate is on.'),
  rowIndex: z.number().int().describe('The row index of the coordinate, zero-based.'),
  columnIndex: z.number().int().describe('The column index of the coordinate, zero-based.'),
});

export type GridCoordinate = z.infer<typeof GridCoordinate>;
