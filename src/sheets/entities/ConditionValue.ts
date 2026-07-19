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
      'A date relative to the current date; provide this or userEnteredValue, not both. Valid only with date-comparison condition types in conditional formatting and filters, never in data validation; in practice that pairs it with DATE_BEFORE and DATE_AFTER (Google documents the ON_OR variants as data-validation types).',
    ),
  userEnteredValue: z
    .string()
    .optional()
    .describe(
      'A value the condition is based on; provide this or relativeDate, not both. Parsed as if the user typed it into a cell, so a value beginning with = or + becomes a live formula that executes in the sheet; do not pass untrusted text that starts with either. ONE_OF_LIST values do not support formulas.',
    ),
});

export type ConditionValue = z.infer<typeof ConditionValue>;
