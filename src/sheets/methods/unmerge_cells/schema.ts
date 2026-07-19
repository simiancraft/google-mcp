import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to unmerge cells in.'),
    range: GridRange.describe(
      'The range within which all merges are unmerged; the range may span multiple whole merges but must not partially span any merge.',
    ),
  }),
  /** The unmerge reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
