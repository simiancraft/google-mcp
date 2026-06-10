import { z } from 'zod';
import { CellValue } from './CellValue.js';
import { DataFilter } from './DataFilter.js';

/**
 * Values to write to the ranges a data filter matches: the write-side
 * counterpart of MatchedValueRange.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdateByDataFilter#DataFilterValueRange
 */
export const DataFilterValueRange = z.object({
  dataFilter: DataFilter.describe(
    'The data filter describing the location of the values in the spreadsheet.',
  ),
  majorDimension: z
    .enum(['ROWS', 'COLUMNS'])
    .optional()
    .describe('The major dimension of the values. Defaults to ROWS.'),
  values: z
    .array(z.array(CellValue))
    .describe(
      'The data to be written; must not exceed the matched ranges, and trailing rows and columns may be omitted.',
    ),
});

export type DataFilterValueRange = z.infer<typeof DataFilterValueRange>;
