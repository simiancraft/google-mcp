import { z } from 'zod';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    ranges: z
      .array(z.string())
      .min(1)
      .describe('The ranges to clear, in A1 notation or R1C1 notation.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The spreadsheet the updates were applied to.'),
    clearedRanges: z
      .array(z.string())
      .optional()
      .describe(
        'The ranges that were cleared, in A1 notation; for an unbounded request, the actual extents that were cleared.',
      ),
  }),
};
