import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * No field mask on this request: only the borders provided change, and an
 * omitted border is left as it is (style NONE erases one explicitly).
 */
export const update_borders = sheetsOperation({
  description:
    "Update the borders of a range: any of the range's top, bottom, left, right, and inner horizontal or vertical borders; borders not provided are untouched.",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateBordersRequest',
  schema,
  handler,
});
