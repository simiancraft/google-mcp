import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to insert into.'),
    range: DimensionRange.describe(
      'The rows or columns to insert: new dimensions appear starting at startIndex, shifting existing ones toward endIndex; the count inserted is endIndex - startIndex.',
    ),
    inheritFromBefore: z
      .boolean()
      .optional()
      .describe(
        'True to give the new dimensions the properties of the dimension before startIndex, false (the default) to inherit from the one after; cannot be true when startIndex is 0.',
      ),
  }),
  /** The insert reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
