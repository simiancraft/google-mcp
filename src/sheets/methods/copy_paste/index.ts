import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const copy_paste = sheetsOperation({
  description:
    'Copy selected data from one grid range to another, optionally transposed; the paste overwrites destination fields and can extend beyond a smaller destination range.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#CopyPasteRequest',
  schema,
  handler,
});
