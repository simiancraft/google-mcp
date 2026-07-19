import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * A removal (of the merge structure, not of values), destructive per the
 * rubric's removal cluster; the surviving upper-left values are untouched.
 */
export const unmerge_cells = sheetsOperation({
  description:
    'Unmerge every merge in a range; the values that survived the original merges are untouched, and the range must not cut through any merge.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UnmergeCellsRequest',
  schema,
  handler,
});
