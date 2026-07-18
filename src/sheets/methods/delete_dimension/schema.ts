import { z } from 'zod';
import { DimensionRange } from '../../entities/DimensionRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to delete from.'),
    range: DimensionRange.describe(
      'The rows or columns to delete; dimensions after the range shift into its place.',
    ),
  }),
  /** The delete reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
