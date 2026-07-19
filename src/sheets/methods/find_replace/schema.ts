import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to search.'),
    find: z.string().describe('The value to search for.'),
    replacement: z
      .string()
      .describe(
        'The replacement text. With includeFormulas, this can rewrite formula source; a resulting formula can execute and reach external endpoints, so do not insert untrusted formula fragments.',
      ),
    matchCase: z.boolean().optional().describe('True for a case-sensitive search.'),
    matchEntireCell: z.boolean().optional().describe('True to match only complete cell contents.'),
    searchByRegex: z
      .boolean()
      .optional()
      .describe(
        'True to treat find as a regular expression and replacement as a replacement pattern.',
      ),
    includeFormulas: z
      .boolean()
      .optional()
      .describe(
        'True to search and rewrite formula source as well as displayed values; changed formulas execute in the sheet and can reach external endpoints.',
      ),
    range: GridRange.optional().describe(
      'The range to search. Provide exactly one of range, sheetId, or allSheets.',
    ),
    sheetId: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('The sheet to search. Provide exactly one of range, sheetId, or allSheets.'),
    allSheets: z
      .literal(true)
      .optional()
      .describe('True to search all sheets. Provide exactly one of range, sheetId, or allSheets.'),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    valuesChanged: z.number().int().describe('The number of non-formula cells changed.'),
    formulasChanged: z.number().int().describe('The number of formula cells changed.'),
    rowsChanged: z.number().int().describe('The number of rows changed.'),
    sheetsChanged: z.number().int().describe('The number of sheets changed.'),
    occurrencesChanged: z
      .number()
      .int()
      .describe(
        'The number of matching occurrences changed, including multiple matches in one cell.',
      ),
  }),
};
