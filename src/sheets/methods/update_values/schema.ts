import { z } from 'zod';
import { CellValue } from '../../entities/CellValue.js';
import { UpdateValuesResponse } from '../../entities/UpdateValuesResponse.js';

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
    majorDimension: z
      .enum(['ROWS', 'COLUMNS'])
      .optional()
      .describe('The major dimension of the values being written. Defaults to ROWS.'),
    valueInputOption: z
      .enum(['RAW', 'USER_ENTERED'])
      .describe(
        'How the input data should be interpreted: RAW stores values as-is; USER_ENTERED parses them as if typed into the UI (numbers, dates, formulas). Required.',
      ),
    includeValuesInResponse: z
      .boolean()
      .optional()
      .describe(
        'Whether the response should include the values of the cells that were updated. Defaults to false.',
      ),
    responseValueRenderOption: z
      .enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'])
      .optional()
      .describe(
        'How values in the response should be rendered. The default render option is FORMATTED_VALUE.',
      ),
    responseDateTimeRenderOption: z
      .enum(['SERIAL_NUMBER', 'FORMATTED_STRING'])
      .optional()
      .describe(
        'How dates, times, and durations in the response should be rendered. Ignored if responseValueRenderOption is FORMATTED_VALUE; the default is SERIAL_NUMBER.',
      ),
  }),
  output: UpdateValuesResponse,
};
