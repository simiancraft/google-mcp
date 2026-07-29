import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const cut_paste = sheetsOperation({
  description:
    'Cut all data from a source range and paste the selected data type at a destination coordinate; the source is cleared and destination fields are overwritten.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#CutPasteRequest',
  schema,
  handler,
});
