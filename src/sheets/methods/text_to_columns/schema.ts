import { z } from 'zod';
import { DelimiterType } from '../../entities/DelimiterType.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the source.'),
    source: GridRange.required({
      sheetId: true,
      startColumnIndex: true,
      endColumnIndex: true,
    }).describe(
      'The source range, which must span exactly one column: provide sheetId and adjacent startColumnIndex/endColumnIndex bounds.',
    ),
    delimiter: z
      .string()
      .optional()
      .describe('The delimiter string; required only when delimiterType is CUSTOM.'),
    delimiterType: DelimiterType.describe('The delimiter type on which to split the text.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
