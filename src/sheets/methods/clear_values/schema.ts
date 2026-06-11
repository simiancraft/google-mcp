import { z } from 'zod';

export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: z.string().describe('The A1 notation or R1C1 notation of the values to clear.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The spreadsheet the updates were applied to.'),
    clearedRange: z
      .string()
      .optional()
      .describe(
        'The range (in A1 notation) that was cleared; for an unbounded request, the actual extent that was cleared.',
      ),
  }),
};
