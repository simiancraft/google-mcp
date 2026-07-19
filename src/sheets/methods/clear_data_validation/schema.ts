import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to clear validation in.'),
    range: GridRange.describe('The range to clear data validation from.'),
    filteredRowsIncluded: z
      .boolean()
      .optional()
      .describe('If true, validation is also cleared from filtered-out rows in the range.'),
  }),
  /** The clear reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
