import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Reordering preserves cells, but repeating produces another random order. */
export const randomize_range = sheetsOperation({
  description:
    'Randomize the order of row slices in a range without discarding cell content; the original order is discarded and cannot be recovered through this surface.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#RandomizeRangeRequest',
  schema,
  handler,
});
