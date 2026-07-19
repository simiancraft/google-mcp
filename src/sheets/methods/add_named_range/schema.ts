import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';
import { NamedRange } from '../../entities/NamedRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to define the name in.'),
    name: z
      .string()
      .describe(
        'The name to define. Must start with a letter or underscore, use only letters, numbers, and underscores, avoid valid cell references such as A1 or R1C1, and be unique in the spreadsheet.',
      ),
    range: GridRange.describe('The range the name refers to.'),
  }),
  output: NamedRange,
};
