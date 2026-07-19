import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the protected range.'),
    protectedRangeId: z.number().int().describe('The ID of the protected range to delete.'),
  }),
  /** The delete reply is empty; we confirm the ids. */
  output: z.object({
    spreadsheetId: z
      .string()
      .describe('The ID of the spreadsheet the protected range was deleted from.'),
    protectedRangeId: z.number().describe('The ID of the deleted protected range.'),
  }),
};
