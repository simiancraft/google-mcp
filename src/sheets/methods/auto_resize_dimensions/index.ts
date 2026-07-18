import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const auto_resize_dimensions = sheetsOperation({
  description:
    'Resize rows or columns to fit their contents, as the UI\'s "Fit to data" does; a later content change does not re-trigger it.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AutoResizeDimensionsRequest',
  schema,
  handler,
});
