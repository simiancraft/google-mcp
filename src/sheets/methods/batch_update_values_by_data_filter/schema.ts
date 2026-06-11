import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DataFilterValueRange } from '../../entities/DataFilterValueRange.js';
import { DateTimeRenderOption } from '../../entities/DateTimeRenderOption.js';
import { ValueInputOption } from '../../entities/ValueInputOption.js';
import { ValueRange } from '../../entities/ValueRange.js';
import { ValueRenderOption } from '../../entities/ValueRenderOption.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdateByDataFilter */
export const schema = {
  input: z.object({
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
      .array(
        z.object({
          updatedRange: z
            .string()
            .optional()
            .describe('The range (in A1 notation) that updates were applied to.'),
          updatedRows: z
            .number()
            .int()
            .optional()
            .describe('The number of rows where at least one cell in the row was updated.'),
          updatedColumns: z
            .number()
            .int()
            .optional()
            .describe('The number of columns where at least one cell in the column was updated.'),
          updatedCells: z.number().int().optional().describe('The number of cells updated.'),
          dataFilter: DataFilter.optional().describe(
            'The data filter that selected the range that was updated.',
          ),
          updatedData: ValueRange.optional().describe(
            "The values of the cells in the matched range after updates; only included when the request's includeValuesInResponse was true.",
          ),
        }),
      )
      .describe('The response for each range updated.'),
  }),
};
