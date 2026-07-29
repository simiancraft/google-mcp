import { z } from 'zod';
import { FilterCriteria } from './FilterCriteria.js';

/**
 * The filter criteria associated with a specific ordinary-grid column.
 * Connected Sheets column references are not carried.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#FilterSpec
 */
export const FilterSpec = z.strictObject({
  filterCriteria: FilterCriteria.describe('The criteria for the column.'),
  columnIndex: z.number().int().min(0).describe('The zero-based column index.'),
});

export type FilterSpec = z.infer<typeof FilterSpec>;
