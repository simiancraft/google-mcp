import { z } from 'zod';

/**
 * A rectangle of cells addressed by sheet id and zero-based half-open index
 * ranges, the structural alternative to A1 notation. Missing indexes mean the
 * range is unbounded on that side.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#GridRange
 */
export const GridRange = z.strictObject({
  sheetId: z.number().int().optional().describe('The sheet this range is on.'),
  startRowIndex: z
    .number()
    .int()
    .optional()
    .describe('The start row (inclusive) of the range, or not set if unbounded.'),
  endRowIndex: z
    .number()
    .int()
    .optional()
    .describe('The end row (exclusive) of the range, or not set if unbounded.'),
  startColumnIndex: z
    .number()
    .int()
    .optional()
    .describe('The start column (inclusive) of the range, or not set if unbounded.'),
  endColumnIndex: z
    .number()
    .int()
    .optional()
    .describe('The end column (exclusive) of the range, or not set if unbounded.'),
});

export type GridRange = z.infer<typeof GridRange>;
