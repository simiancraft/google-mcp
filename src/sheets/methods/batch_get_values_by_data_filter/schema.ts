import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { MatchedValueRange } from '../../entities/MatchedValueRange.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchGetByDataFilter */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve data from.'),
    dataFilters: z
      .array(DataFilter)
      .min(1)
      .describe(
        'The data filters used to match the ranges of values to retrieve; ranges matching any filter are included.',
      ),
    majorDimension: z
      .enum(['ROWS', 'COLUMNS'])
      .optional()
      .describe('The major dimension that results should use. Defaults to ROWS.'),
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
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the data was retrieved from.'),
    valueRanges: z
      .array(MatchedValueRange)
      .describe('The requested values with the list of data filters that matched them.'),
  }),
};
