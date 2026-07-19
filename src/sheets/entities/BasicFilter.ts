import { z } from 'zod';
import { FilterSpec } from './FilterSpec.js';
import { GridRange } from './GridRange.js';
import { SortSpec } from './SortSpec.js';

/**
 * The default filter associated with a sheet. This curated shape carries
 * ordinary range-backed filters; table backing and the deprecated criteria
 * map are not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#BasicFilter
 */
export const BasicFilter = z.strictObject({
  range: GridRange.optional().describe('The range the filter covers.'),
  sortSpecs: z
    .array(SortSpec)
    .optional()
    .describe('The sort order per column; later specifications break ties from earlier ones.'),
  filterSpecs: z.array(FilterSpec).optional().describe('The filter criteria per column.'),
});

export type BasicFilter = z.infer<typeof BasicFilter>;
