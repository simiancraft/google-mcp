import { z } from 'zod';
import { ConditionValue } from './ConditionValue.js';

/**
 * A condition that can evaluate to true or false, the shared predicate
 * vocabulary of data validation, conditional formatting, and filters. How
 * many values a type takes depends on the type: the comparisons take one,
 * the BETWEEN family exactly two, ONE_OF_LIST any number, and the
 * emptiness and validity checks none.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#BooleanCondition
 */
export const BooleanCondition = z.strictObject({
  type: z
    .enum([
      'NUMBER_GREATER',
      'NUMBER_GREATER_THAN_EQ',
      'NUMBER_LESS',
      'NUMBER_LESS_THAN_EQ',
      'NUMBER_EQ',
      'NUMBER_NOT_EQ',
      'NUMBER_BETWEEN',
      'NUMBER_NOT_BETWEEN',
      'TEXT_CONTAINS',
      'TEXT_NOT_CONTAINS',
      'TEXT_STARTS_WITH',
      'TEXT_ENDS_WITH',
      'TEXT_EQ',
      'TEXT_IS_EMAIL',
      'TEXT_IS_URL',
      'DATE_EQ',
      'DATE_BEFORE',
      'DATE_AFTER',
      'DATE_ON_OR_BEFORE',
      'DATE_ON_OR_AFTER',
      'DATE_BETWEEN',
      'DATE_NOT_BETWEEN',
      'DATE_IS_VALID',
      'ONE_OF_RANGE',
      'ONE_OF_LIST',
      'BLANK',
      'NOT_BLANK',
      'CUSTOM_FORMULA',
      'BOOLEAN',
    ])
    .describe(
      'The type of condition. Support varies by context: TEXT_IS_EMAIL, TEXT_IS_URL, DATE_IS_VALID, ONE_OF_RANGE, ONE_OF_LIST, and BOOLEAN apply only to data validation; TEXT_STARTS_WITH, TEXT_ENDS_WITH, BLANK, and NOT_BLANK apply only to conditional formatting and filters.',
    ),
  values: z
    .array(ConditionValue)
    .optional()
    .describe(
      'The values of the condition; how many are required depends on the type (comparisons take one, the BETWEEN family exactly two, ONE_OF_LIST any number, the no-argument checks none).',
    ),
});

export type BooleanCondition = z.infer<typeof BooleanCondition>;
