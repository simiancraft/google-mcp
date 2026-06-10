import { z } from 'zod';
import { ValueRange } from '../../entities/ValueRange.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve data from.'),
    range: z
      .string()
      .describe('The A1 notation or R1C1 notation of the range to retrieve values from.'),
    majorDimension: z
      .enum(['ROWS', 'COLUMNS'])
      .optional()
      .describe(
        'The major dimension that results should use. For A1=1,B1=2,A2=3,B2=4: ROWS returns [[1,2],[3,4]], COLUMNS returns [[1,3],[2,4]]. Defaults to ROWS.',
      ),
    valueRenderOption: z
      .enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'])
      .optional()
      .describe(
        'How values should be represented in the output. The default render option is FORMATTED_VALUE.',
      ),
    dateTimeRenderOption: z
      .enum(['SERIAL_NUMBER', 'FORMATTED_STRING'])
      .optional()
      .describe(
        'How dates, times, and durations should be represented in the output. Ignored if valueRenderOption is FORMATTED_VALUE; the default is SERIAL_NUMBER.',
      ),
  }),
  output: ValueRange,
};
