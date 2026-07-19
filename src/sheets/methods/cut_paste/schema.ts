import { z } from 'zod';
import { GridCoordinate } from '../../entities/GridCoordinate.js';
import { GridRange } from '../../entities/GridRange.js';
import { PasteType } from '../../entities/PasteType.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to move data within.'),
    source: GridRange.describe('The source range to cut; all source data is removed.'),
    destination: GridCoordinate.describe('The top-left coordinate at which to paste the data.'),
    pasteType: PasteType.describe(
      'The kind of data to paste. All source data is cut regardless of this selection; formula-bearing paste types execute formulas at the destination, where they may reach external endpoints.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
