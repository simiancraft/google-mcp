import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Additive but index-addressed: repeating inserts another range and shifts again. */
export const insert_range = sheetsOperation({
  description:
    'Insert blank cells into a range, shifting existing cells down or right within the current sheet boundaries.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#InsertRangeRequest',
  schema,
  handler,
});
