import { z } from 'zod';
import { UpdateValuesResponse } from '../../entities/UpdateValuesResponse.js';
import { ValueRange } from '../../entities/ValueRange.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    data: z
      .array(ValueRange)
      .min(1)
      .describe(
        'The new values to apply to the spreadsheet: one ValueRange per target range, each with its range and values set.',
      ),
    valueInputOption: z
      .enum(['RAW', 'USER_ENTERED'])
      .describe(
        'How the input data should be interpreted: RAW stores values as-is; USER_ENTERED parses them as if typed into the UI (numbers, dates, formulas). Required.',
      ),
    includeValuesInResponse: z
      .boolean()
      .optional()
      .describe(
        'Whether each response should include the values of the cells that were updated. Defaults to false.',
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
  output: z.object({
    spreadsheetId: z.string().describe('The spreadsheet the updates were applied to.'),
    totalUpdatedRows: z
      .number()
      .int()
      .optional()
      .describe('The total number of rows where at least one cell in the row was updated.'),
    totalUpdatedColumns: z
      .number()
      .int()
      .optional()
      .describe('The total number of columns where at least one cell in the column was updated.'),
    totalUpdatedCells: z.number().int().optional().describe('The total number of cells updated.'),
    totalUpdatedSheets: z
      .number()
      .int()
      .optional()
      .describe('The total number of sheets where at least one cell in the sheet was updated.'),
    responses: z
      .array(UpdateValuesResponse)
      .describe('One UpdateValuesResponse per requested range, in request order.'),
  }),
};
