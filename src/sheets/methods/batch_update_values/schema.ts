import { z } from 'zod';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { UpdateValuesResponse } from '../../entities/UpdateValuesResponse.js';
import { ValueInputOption } from '../../entities/ValueInputOption.js';
import { ValueRange } from '../../entities/ValueRange.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    data: z
      .array(ValueRange)
      .min(1)
      .describe(
        'The new values to apply to the spreadsheet: one ValueRange per target range, each with its range and values set.',
      ),
    valueInputOption: ValueInputOption,
    includeValuesInResponse: z
      .boolean()
      .optional()
      .describe(
        'Whether each response should include the values of the cells that were updated. Defaults to false.',
      ),
    responseValueRenderOption: ValueRenderOption.optional(),
    responseDateTimeRenderOption: DateTimeRenderOption.optional(),
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
