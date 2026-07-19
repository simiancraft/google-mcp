import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Index-addressed: repeating deletes whatever shifted into the same range. */
export const delete_range = sheetsOperation({
  description:
    'Delete cells from a range and shift remaining cells upward or left into the deleted area.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteRangeRequest',
  schema,
  handler,
});
