import { z } from 'zod';
import { Border } from '../../entities/Border.js';
import { GridRange } from '../../entities/GridRange.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    range: GridRange.describe('The range whose borders to update.'),
    top: Border.optional().describe('The border to put at the top of the range.'),
    bottom: Border.optional().describe('The border to put at the bottom of the range.'),
    left: Border.optional().describe('The border to put at the left of the range.'),
    right: Border.optional().describe('The border to put at the right of the range.'),
    innerHorizontal: Border.optional().describe('The horizontal border to put within the range.'),
    innerVertical: Border.optional().describe('The vertical border to put within the range.'),
  }),
  /** The borders reply is empty; we confirm the id. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
