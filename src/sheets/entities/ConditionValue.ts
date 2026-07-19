import { z } from 'zod';

/**
 * One value of a condition: either a literal (parsed as if typed into a
 * cell, so formulas work) or a date relative to the current date. Provide
 * exactly one of the two fields.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#ConditionValue
 */
export const ConditionValue = z.strictObject({
  relativeDate: z
    .enum(['PAST_YEAR', 'PAST_MONTH', 'PAST_WEEK', 'YESTERDAY', 'TODAY', 'TOMORROW'])
    .optional()
    .describe(
      'A date relative to the current date. Valid only with DATE_BEFORE, DATE_AFTER, DATE_ON_OR_BEFORE, or DATE_ON_OR_AFTER, and only in conditional formatting and filters, not in data validation.',
    ),
  userEnteredValue: z
    .string()
    .optional()
    .describe(
      'A value the condition is based on, parsed as if the user typed it into a cell; formulas are supported and must begin with an = or a +.',
    ),
});

export type ConditionValue = z.infer<typeof ConditionValue>;
