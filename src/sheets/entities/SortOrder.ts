import { z } from 'zod';

/**
 * The direction in which data is sorted.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#SortOrder
 */
export const SortOrder = z.enum(['ASCENDING', 'DESCENDING']);

export type SortOrder = z.infer<typeof SortOrder>;
