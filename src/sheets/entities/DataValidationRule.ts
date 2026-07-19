import { z } from 'zod';
import { BooleanCondition } from './BooleanCondition.js';

/**
 * A data validation rule: a condition cell input must satisfy, optionally
 * strict (rejecting invalid input rather than flagging it) and optionally
 * rendered as a custom UI (ONE_OF_LIST and ONE_OF_RANGE become dropdowns).
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells#DataValidationRule
 */
export const DataValidationRule = z.strictObject({
  condition: BooleanCondition.describe(
    'The condition that data in the cell must match; relative dates are not supported in data validation.',
  ),
  inputMessage: z
    .string()
    .optional()
    .describe('A message to show the user when adding data to the cell.'),
  strict: z.boolean().optional().describe('True if invalid data should be rejected.'),
  showCustomUi: z
    .boolean()
    .optional()
    .describe(
      'True if the UI should be customized based on the kind of condition; ONE_OF_LIST and ONE_OF_RANGE conditions show a dropdown.',
    ),
});

export type DataValidationRule = z.infer<typeof DataValidationRule>;
