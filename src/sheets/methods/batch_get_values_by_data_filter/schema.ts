import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { MajorDimension } from '../../entities/MajorDimension.js';
import { MatchedValueRange } from '../../entities/MatchedValueRange.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve data from.'),
    dataFilters: z
      .array(DataFilter)
      .min(1)
      .describe(
        'The data filters used to match the ranges of values to retrieve; ranges matching any filter are included.',
      ),
    majorDimension: MajorDimension.optional(),
    valueRenderOption: ValueRenderOption.optional(),
    dateTimeRenderOption: DateTimeRenderOption.optional(),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the data was retrieved from.'),
    valueRanges: z
      .array(MatchedValueRange)
      .describe('The requested values with the list of data filters that matched them.'),
  }),
};
