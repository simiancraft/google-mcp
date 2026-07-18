import { z } from 'zod';
import { ColorStyle } from '../../entities/ColorStyle.js';
import { GridProperties } from '../../entities/GridProperties.js';
import { SheetProperties } from '../../entities/SheetProperties.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to add the sheet to.'),
    title: z
      .string()
      .optional()
      .describe('The name of the new sheet. Omitted, Google assigns "SheetN".'),
    index: z
      .number()
      .int()
      .optional()
      .describe(
        'The zero-based position to insert the sheet at; existing sheets shift over. Omitted, the sheet is added at the end.',
      ),
    hidden: z.boolean().optional().describe('True to create the sheet hidden in the UI.'),
    tabColorStyle: ColorStyle.optional().describe('The color of the sheet tab in the UI.'),
    gridProperties: GridProperties.optional().describe(
      'The grid dimensions and frozen row/column counts of the new sheet.',
    ),
  }),
  output: SheetProperties,
};
