import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Range fields are masked per subkey; list fields replace their complete list. */
export const update_filter_view = sheetsOperation({
  description:
    'Update a filter view by filterViewId; only provided fields change, with range fields masked per subkey and sortSpecs or filterSpecs replacing their complete respective lists.',
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
