import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to merge cells in.'),
    range: GridRange.describe('The range of cells to merge.'),
    mergeType: z
      .enum(['MERGE_ALL', 'MERGE_COLUMNS', 'MERGE_ROWS'])
      .describe(
        'How the cells should be merged: MERGE_ALL makes one merge of the whole range, MERGE_COLUMNS one merge per column, MERGE_ROWS one merge per row.',
      ),
  }),
  /** The merge reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
