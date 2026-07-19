import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** The reply returns all groups after the add; REST does not define their reply ordering. */
export const add_dimension_group = sheetsOperation({
  description:
    'Group a row or column range for collapse and expansion; overlapping groups can be resized or moved to deeper nesting, cell content is untouched, and the reply returns all groups for that dimension.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddDimensionGroupRequest',
  schema,
  handler,
});
