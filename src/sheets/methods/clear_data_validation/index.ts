import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The clearing half of SetDataValidationRequest (a request with no rule
 * clears the range's validation); split from `set_data_validation` because
 * clearing is a removal and the annotations differ.
 */
export const clear_data_validation = sheetsOperation({
  description:
    'Remove all data validation rules from every cell in a range; the cell values are untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#SetDataValidationRequest',
  schema,
  handler,
});
