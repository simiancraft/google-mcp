import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** The request decrements group depth across a range, so repetition can remove more grouping. */
export const delete_dimension_group = sheetsOperation({
  description:
    'Delete grouping over a row or column range by decrementing its group depth; overlapping groups can be split or resized, the grouping change is not automatically reversible, and cell content is untouched.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#DeleteDimensionGroupRequest',
  schema,
  handler,
});
