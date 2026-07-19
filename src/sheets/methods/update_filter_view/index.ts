import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Range fields are masked per subkey; list fields replace their complete list. */
export const update_filter_view = sheetsOperation({
  description:
    'Update a filter view by filterViewId; only provided fields change, except that providing range or namedRangeId selects that backing and detaches the other. Range fields are masked per subkey, while sortSpecs or filterSpecs replace their complete respective lists.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateFilterViewRequest',
  schema,
  handler,
});
