import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the rule.'),
    sheetId: z.number().int().describe('The sheet the rule is being deleted from.'),
    index: z.number().int().min(0).describe('The zero-based index of the rule to be deleted.'),
  }),
  /** The reply carries the deleted rule; we confirm the id and the index. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the rule was deleted from.'),
    index: z
      .number()
      .describe('The index the rule was deleted from; later rules shifted up by one.'),
  }),
};
