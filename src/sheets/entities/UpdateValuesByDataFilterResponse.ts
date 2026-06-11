import { z } from 'zod';
import { DataFilter } from './DataFilter.js';
import { ValueRange } from './ValueRange.js';

/**
 * The result of writing one data-filter-matched range: the per-range sibling
 * of UpdateValuesResponse, carrying the filter that selected the range
 * instead of a spreadsheet id.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdateByDataFilter#UpdateValuesByDataFilterResponse
 */
export const UpdateValuesByDataFilterResponse = z.object({
  updatedRange: z
    .string()
    .optional()
    .describe('The range (in A1 notation) that updates were applied to.'),
  updatedRows: z
    .number()
    .int()
    .optional()
    .describe('The number of rows where at least one cell in the row was updated.'),
  updatedColumns: z
    .number()
    .int()
    .optional()
    .describe('The number of columns where at least one cell in the column was updated.'),
  updatedCells: z.number().int().optional().describe('The number of cells updated.'),
  dataFilter: DataFilter.optional().describe(
    'The data filter that selected the range that was updated.',
  ),
  updatedData: ValueRange.optional().describe(
    "The values of the cells in the matched range after updates; only included when the request's includeValuesInResponse was true.",
  ),
});

export type UpdateValuesByDataFilterResponse = z.infer<typeof UpdateValuesByDataFilterResponse>;
