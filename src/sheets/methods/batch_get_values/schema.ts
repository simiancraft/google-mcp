import { z } from 'zod';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { MajorDimension } from '../../entities/MajorDimension.js';
import { ValueRange } from '../../entities/ValueRange.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve data from.'),
    ranges: z
      .array(z.string())
      .min(1)
      .describe('The A1 notation or R1C1 notation of the ranges to retrieve values from.'),
    majorDimension: MajorDimension.optional(),
    valueRenderOption: ValueRenderOption.optional(),
    dateTimeRenderOption: DateTimeRenderOption.optional(),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the data was retrieved from.'),
    valueRanges: z
      .array(ValueRange)
      .describe('The requested values, in the same order as the requested ranges.'),
  }),
};
