import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

export const delete_banding = sheetsOperation({
  description:
    'Permanently remove a banded range by ID, removing its alternating-color rule while leaving cell values and unrelated formatting untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteBandingRequest',
  schema,
  handler,
});
