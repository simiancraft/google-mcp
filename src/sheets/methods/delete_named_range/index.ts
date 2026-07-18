import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Removes the name only: the cells keep their contents, and formulas that
 * referenced the name break to #NAME?.
 */
export const delete_named_range = sheetsOperation({
  description:
    'Delete a named range from a spreadsheet by its ID; the cells it covered are untouched, but formulas referencing the name break.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteNamedRangeRequest',
  schema,
  handler,
});
