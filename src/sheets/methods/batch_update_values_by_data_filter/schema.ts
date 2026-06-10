import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DataFilterValueRange } from '../../entities/DataFilterValueRange.js';
import { ValueRange } from '../../entities/ValueRange.js';

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
