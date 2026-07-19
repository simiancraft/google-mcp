import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const duplicate_filter_view = sheetsOperation({
  description:
    "Duplicate a filter view by filterId (the view's stable filterViewId) and return the new view and its new ID.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DuplicateFilterViewRequest',
  schema,
  handler,
});
