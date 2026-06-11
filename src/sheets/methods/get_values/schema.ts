import { z } from 'zod';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { MajorDimension } from '../../entities/MajorDimension.js';
import { ValueRange } from '../../entities/ValueRange.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve data from.'),
    range: z
      .string()
      .describe('The A1 notation or R1C1 notation of the range to retrieve values from.'),
    majorDimension: MajorDimension.optional(),
    valueRenderOption: ValueRenderOption.optional(),
    dateTimeRenderOption: DateTimeRenderOption.optional(),
  }),
  output: ValueRange,
};
