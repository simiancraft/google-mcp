import { z } from 'zod';
import { ValueRange } from './ValueRange.js';

/**
 * The result of writing a range: which range was touched and how many rows,
 * columns, and cells changed. Returned by `update_values` and, one per range,
 * inside the batch update responses.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update#UpdateValuesResponse
 */
export const UpdateValuesResponse = z.object({
  spreadsheetId: z.string().describe('The spreadsheet the updates were applied to.'),
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
  updatedData: ValueRange.optional().describe(
    "The values of the cells after updates were applied; only included when the request's includeValuesInResponse was true.",
  ),
});

export type UpdateValuesResponse = z.infer<typeof UpdateValuesResponse>;
