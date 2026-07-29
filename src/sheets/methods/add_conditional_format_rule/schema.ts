import { z } from 'zod';
import { ConditionalFormatRule } from '../../entities/ConditionalFormatRule.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to add the rule to.'),
    rule: ConditionalFormatRule.describe('The rule to add.'),
    index: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe(
        'The zero-based index where the rule should be inserted; earlier rules take precedence where rules overlap, and an omitted index inserts at 0 (highest precedence).',
      ),
  }),
  /** The add reply is empty (rules have no ID); we confirm the id and where the rule landed. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet the rule was added to.'),
    index: z
      .number()
      .describe(
        'The zero-based index the rule was inserted at; rules previously at or after it shifted down by one.',
      ),
  }),
};
