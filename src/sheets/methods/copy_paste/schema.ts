import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';
import { PasteOrientation } from '../../entities/PasteOrientation.js';
import { PasteType } from '../../entities/PasteType.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to copy within.'),
    source: GridRange.describe('The source range to copy.'),
    destination: GridRange.describe(
      'The destination range. A repeated-size destination tiles the source; a smaller destination does not clip it, so copied data can extend beyond this range and overwrite cells.',
    ),
    pasteType: PasteType.describe(
      'The kind of data to paste. PASTE_FORMULA and formula-bearing paste types execute copied formulas at the destination, where they may reach external endpoints.',
    ),
    pasteOrientation: PasteOrientation.describe(
      'Whether to paste normally or transpose rows and columns.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
