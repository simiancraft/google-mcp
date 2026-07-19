import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the named range.'),
    namedRangeId: z.string().describe('The ID of the named range to delete.'),
  }),
  /** The delete reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z
      .string()
      .describe('The ID of the spreadsheet the named range was deleted from.'),
    namedRangeId: z.string().describe('The ID of the deleted named range.'),
  }),
};
