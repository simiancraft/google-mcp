import { z } from 'zod';
import { DataFilter } from './DataFilter.js';
import { ValueRange } from './ValueRange.js';

/**
 * A value range together with the data filters from the request that matched
 * it; the unit returned by the by-data-filter reads.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter#MatchedValueRange
 */
export const MatchedValueRange = z.object({
  valueRange: ValueRange.optional().describe('The values matched by the DataFilter.'),
  dataFilters: z
    .array(DataFilter)
    .optional()
    .describe('The DataFilters from the request that matched the range of values.'),
});

export type MatchedValueRange = z.infer<typeof MatchedValueRange>;
