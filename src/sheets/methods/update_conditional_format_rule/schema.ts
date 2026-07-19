import { z } from 'zod';
import { ConditionalFormatRule } from '../../entities/ConditionalFormatRule.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the rule.'),
    index: z
      .number()
      .int()
      .min(0)
      .describe('The zero-based index of the rule that should be replaced.'),
    rule: ConditionalFormatRule.describe(
      "The rule that should replace the rule at the given index; the rule's ranges identify the sheet.",
    ),
  }),
  /** The reply echoes the indexes; the rule payloads are not projected. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    index: z.number().describe('The zero-based index of the replaced rule.'),
  }),
};
