import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The ID for `delete_named_range` comes back in the reply; existing names are
 * listed by `get_spreadsheet` under `namedRanges`.
 */
export const add_named_range = sheetsOperation({
  description:
    'Define a named range in a spreadsheet, so formulas can say =REVENUE instead of =INPUTS!B38 and reads can pass the name where a range is expected; returns the named range with its assigned ID.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddNamedRangeRequest',
  schema,
  handler,
});
