import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_filter_view = sheetsOperation({
  description: 'Delete a filter view by its stable filterViewId.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteFilterViewRequest',
  schema,
  handler,
});
