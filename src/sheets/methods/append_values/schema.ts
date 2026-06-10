import { z } from 'zod';
import { CellValue } from '../../entities/CellValue.js';
import { UpdateValuesResponse } from '../../entities/UpdateValuesResponse.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: z
      .string()
      .describe(
        'The A1 notation of a range to search for a logical table of data; values are appended after the last row of that table, not written at this range.',
      ),
    values: z
      .array(z.array(CellValue))
      .describe(
        'The data to append, an array of arrays: each inner array is one major dimension (one row, by default).',
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
    insertDataOption: z
      .enum(['OVERWRITE', 'INSERT_ROWS'])
      .optional()
      .describe(
        'How the input data should be inserted: OVERWRITE writes over anything after the table (without overflowing the sheet); INSERT_ROWS inserts new rows for the new data.',
      ),
    includeValuesInResponse: z
      .boolean()
      .optional()
      .describe(
        'Whether the response should include the values of the cells that were appended. Defaults to false.',
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
    tableRange: z
      .string()
      .optional()
      .describe(
        'The range (in A1 notation) of the table that values are being appended to, before the values were appended; empty if no table was found.',
      ),
    updates: UpdateValuesResponse.optional().describe(
      'Information about the updates that were applied.',
    ),
  }),
};
