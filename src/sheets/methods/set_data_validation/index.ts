import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * SetDataValidationRequest with `rule` absent clears validation instead of
 * setting it, a removal; that half ships as `clear_data_validation` so the
 * annotations stay truthful per half (the files/update page-split
 * precedent). Here the rule is required.
 */
export const set_data_validation = sheetsOperation({
  description:
    'Set a data validation rule on every cell in a range (filtered-out rows only when filteredRowsIncluded), replacing any validation already there: a dropdown (ONE_OF_LIST or ONE_OF_RANGE with showCustomUi), a constraint (number, date, or text conditions), or a checkbox (BOOLEAN); strict rules reject invalid input.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#SetDataValidationRequest',
  schema,
  handler,
});
