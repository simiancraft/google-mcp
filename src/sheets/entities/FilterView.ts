import { z } from 'zod';
import { FilterSpec } from './FilterSpec.js';
import { GridRange } from './GridRange.js';
import { SortSpec } from './SortSpec.js';

/**
 * A named filter view whose filterViewId is its stable identity. Table-backed
 * views and the deprecated criteria map are not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#FilterView
 */
export const FilterView = z.strictObject({
  filterViewId: z.number().int().min(0).optional().describe('The ID of the filter view.'),
  title: z.string().optional().describe('The name of the filter view.'),
  range: GridRange.optional().describe(
    'The range this filter view covers. When writing, provide at most one of range or namedRangeId.',
  ),
  namedRangeId: z
    .string()
    .optional()
    .describe(
      'The named range backing this filter view. When writing, provide at most one of range or namedRangeId.',
    ),
  sortSpecs: z
    .array(SortSpec)
    .optional()
    .describe('The sort order per column; later specifications break ties from earlier ones.'),
  filterSpecs: z
    .array(FilterSpec)
    .optional()
    .describe('The criteria for showing or hiding values per column.'),
});

export type FilterView = z.infer<typeof FilterView>;
