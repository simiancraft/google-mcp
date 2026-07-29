import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const add_banding = sheetsOperation({
  description:
    'Add alternating row or column colors over a range and return the banded range with its stable ID; when row and column banding overlap, headers and footers outrank band colors, first bands outrank second bands, and row properties then outrank column properties, while cell values remain untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddBandingRequest',
  schema,
  handler,
});
