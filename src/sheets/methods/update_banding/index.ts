import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Structured range and property masks expand one level so sibling colors survive. */
export const update_banding = sheetsOperation({
  description:
    'Update a banded range by ID, changing its covered range or selected row and column colors; only the provided fields change, moving the range removes that banding outside the new range, and cell values remain untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateBandingRequest',
  schema,
  handler,
});
