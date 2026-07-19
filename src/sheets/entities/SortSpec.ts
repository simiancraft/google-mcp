import { z } from 'zod';
import { SortOrder } from './SortOrder.js';

/**
 * A sort order associated with a specific column or row. This curated shape
 * addresses ordinary grid dimensions; color and Connected Sheets sorts are
 * not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#SortSpec
 */
export const SortSpec = z.strictObject({
  dimensionIndex: z
    .number()
    .int()
    .min(0)
    .describe('The zero-based column or row index the sort applies to.'),
  sortOrder: SortOrder.describe('The order in which to sort the dimension.'),
});

export type SortSpec = z.infer<typeof SortSpec>;

/**
 * The total read-side shape of a sort specification. Read projections retain
 * every upstream element, keeping new sort-order vocabulary as an open string
 * and omitting the ordinary-grid dimension for Connected Sheets sorts.
 */
export const SortSpecReadout = z.object({
  dimensionIndex: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('The zero-based column or row index the sort applies to, when ordinary-grid.'),
  sortOrder: z
    .string()
    .optional()
    .describe('The upstream sort order; the write vocabulary is ASCENDING or DESCENDING.'),
});

export type SortSpecReadout = z.infer<typeof SortSpecReadout>;
