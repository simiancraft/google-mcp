import { z } from 'zod';
import { CellValue } from './CellValue.js';
import { MajorDimension } from './MajorDimension.js';

/**
 * A range of cell values: data within a rectangle of the spreadsheet, addressed
 * in A1 notation. The unit every values operation reads and writes.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
 */
export const ValueRange = z.object({
  range: z
    .string()
    .optional()
    .describe(
      'The range the values cover, in A1 notation. For output, this range indicates the entire requested range, even though the values will exclude trailing rows and columns.',
    ),
  majorDimension: MajorDimension.optional().describe(
    'The major dimension of the values. For output, if the spreadsheet data is A1=1,B1=2,A2=3,B2=4, then requesting range=A1:B2,majorDimension=ROWS returns [[1,2],[3,4]], whereas majorDimension=COLUMNS returns [[1,3],[2,4]]. Defaults to ROWS.',
  ),
  values: z
    .array(z.array(CellValue))
    .optional()
    .describe(
      'The data that was read or to be written, an array of arrays: the outer array is all the data, each inner array a major dimension. Rows may be ragged; the API omits this field entirely for an empty range.',
    ),
});

export type ValueRange = z.infer<typeof ValueRange>;
