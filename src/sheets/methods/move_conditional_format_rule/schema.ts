import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the rule.'),
    sheetId: z.number().int().describe('The sheet of the rule to move.'),
    index: z
      .number()
      .int()
      .min(0)
      .describe('The zero-based index of the rule that should be moved.'),
    newIndex: z
      .number()
      .int()
      .min(0)
      .describe('The zero-based new index the rule should end up at.'),
  }),
  /** The reply echoes the indexes; the rule payloads are not projected. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    oldIndex: z.number().describe('The zero-based index the rule was moved from.'),
    newIndex: z.number().describe('The zero-based index the rule ended up at.'),
  }),
};
