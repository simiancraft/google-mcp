import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const add_filter_view = sheetsOperation({
  description:
    'Add a named filter view over a range or named range, optionally with sorts and per-column criteria; returns its stable filterViewId.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddFilterViewRequest',
  schema,
  handler,
});
