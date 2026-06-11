import { z } from 'zod';
import { CellValue } from '../../entities/CellValue.js';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { MajorDimension } from '../../entities/MajorDimension.js';
import { UpdateValuesResponse } from '../../entities/UpdateValuesResponse.js';
import { ValueInputOption } from '../../entities/ValueInputOption.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: z
      .string()
      .describe('The A1 notation of the values to update; the values overwrite this range.'),
    values: z
      .array(z.array(CellValue))
      .describe(
        'The data to write, an array of arrays: each inner array is one major dimension (one row, by default).',
      ),
    majorDimension: MajorDimension.optional(),
    valueInputOption: ValueInputOption,
    includeValuesInResponse: z
      .boolean()
      .optional()
      .describe(
        'Whether the response should include the values of the cells that were updated. Defaults to false.',
      ),
    responseValueRenderOption: ValueRenderOption.optional(),
    responseDateTimeRenderOption: DateTimeRenderOption.optional(),
  }),
  output: UpdateValuesResponse,
};
