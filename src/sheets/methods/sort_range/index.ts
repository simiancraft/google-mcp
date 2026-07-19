import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/** Reordering preserves every cell and is an idempotent, non-destructive update. */
export const sort_range = sheetsOperation({
  description:
    'Sort the rows in a range by one or more columns, with later sort specifications breaking ties; only cells inside the range move, so a column-bounded range reorders its slice while columns outside it stay fixed. Include every column of the records to keep rows aligned.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#SortRangeRequest',
  schema,
  handler,
});
