import { z } from 'zod';

/**
 * The dimensions of a grid sheet: how many rows and columns it holds and how
 * many of each are frozen. A projection of the REST `GridProperties` (the UI
 * flags `hideGridlines` and the group-control toggles are not carried).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.sheets#GridProperties
 */
export const GridProperties = z.strictObject({
  rowCount: z.number().int().optional().describe('The number of rows in the grid.'),
  columnCount: z.number().int().optional().describe('The number of columns in the grid.'),
  frozenRowCount: z
    .number()
    .int()
    .optional()
    .describe('The number of rows that are frozen in the grid.'),
  frozenColumnCount: z
    .number()
    .int()
    .optional()
    .describe('The number of columns that are frozen in the grid.'),
});

export type GridProperties = z.infer<typeof GridProperties>;
