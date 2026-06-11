import { z } from 'zod';

/**
 * A span of rows or columns on one sheet: a dimension plus zero-based half-open
 * indexes. Missing indexes mean the span is unbounded on that side.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#DimensionRange
 */
export const DimensionRange = z.strictObject({
  sheetId: z.number().int().optional().describe('The sheet this span is on.'),
  dimension: z.enum(['ROWS', 'COLUMNS']).optional().describe('The dimension of the span.'),
  startIndex: z
    .number()
    .int()
    .optional()
    .describe('The start (inclusive) of the span, or not set if unbounded.'),
  endIndex: z
    .number()
    .int()
    .optional()
    .describe('The end (exclusive) of the span, or not set if unbounded.'),
});

export type DimensionRange = z.infer<typeof DimensionRange>;
