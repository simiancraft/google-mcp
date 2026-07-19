import { sheetsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Destructive: merging keeps only the upper-left non-empty value of each
 * merge and discards the rest. Existing merges are listed per sheet by
 * `get_spreadsheet` under `merges`.
 */
export const merge_cells = sheetsOperation({
  description:
    'Merge a range of cells into one (MERGE_ALL), one merge per column (MERGE_COLUMNS), or one per row (MERGE_ROWS), for real grouped headers instead of text placed near each other; only the upper-left non-empty value of each merge is kept.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#MergeCellsRequest',
  schema,
  handler,
});
