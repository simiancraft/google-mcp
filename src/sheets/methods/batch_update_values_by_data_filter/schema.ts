import { z } from 'zod';
import { DataFilterValueRange } from '../../entities/DataFilterValueRange.js';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { UpdateValuesByDataFilterResponse } from '../../entities/UpdateValuesByDataFilterResponse.js';
import { ValueInputOption } from '../../entities/ValueInputOption.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    data: z
      .array(DataFilterValueRange)
      .min(1)
      .describe(
        'The new values to apply: one entry per data filter; when a filter matches multiple ranges, the values apply to all of them.',
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
      .array(UpdateValuesByDataFilterResponse)
      .describe('The response for each range updated.'),
  }),
};
