import { z } from 'zod';
import { FilterSpec } from './FilterSpec.js';
import { GridRange } from './GridRange.js';
import { SortSpec, SortSpecReadout } from './SortSpec.js';

/**
 * A named filter view whose filterViewId is its stable identity. Read
 * projections retain table-backed views but omit their tableId backing detail;
 * the deprecated criteria map is normalized into filterSpecs.
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

/** Read-side FilterView shape with required identity and total sort readout. */
export const FilterViewReadout = FilterView.extend({
  filterViewId: z.number().int().min(0).describe('The ID of the filter view.'),
  sortSpecs: z
    .array(SortSpecReadout)
    .optional()
    .describe('The sort order per column; later specifications break ties from earlier ones.'),
});

export type FilterViewReadout = z.infer<typeof FilterViewReadout>;
