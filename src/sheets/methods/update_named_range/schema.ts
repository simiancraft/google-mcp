import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the named range.'),
    namedRangeId: z.string().describe('The ID of the named range to update.'),
    name: z
      .string()
      .optional()
      .describe(
        'The new name. Renaming updates syntactic cell and range references to this named range, but does not rewrite string references such as INDIRECT("name").',
      ),
    range: GridRange.optional().describe(
      'The new range represented by the name; only the provided range coordinates change.',
    ),
  }),
  /** The update reply is empty; confirm the target and derived mask. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the updated spreadsheet.'),
    namedRangeId: z.string().describe('The ID of the updated named range.'),
    updatedFields: z.string().describe('The field mask applied to the named range.'),
  }),
};
