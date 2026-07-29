import { z } from 'zod';
import { DataValidationRule } from '../../entities/DataValidationRule.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to set validation in.'),
    range: GridRange.describe('The range the data validation rule should apply to.'),
    rule: DataValidationRule.describe(
      'The data validation rule to set on each cell in the range, replacing any validation already there.',
    ),
    filteredRowsIncluded: z
      .boolean()
      .optional()
      .describe('If true, the data validation rule is applied to filtered rows as well.'),
  }),
  /** The set reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
