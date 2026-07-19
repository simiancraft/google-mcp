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
