import { z } from 'zod';
import { ColorStyle } from '../../entities/ColorStyle.js';
import { GridProperties } from '../../entities/GridProperties.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet.'),
    sheetId: z.number().int().describe('The ID of the sheet to update.'),
    title: z.string().optional().describe('The new name of the sheet.'),
    index: z
      .number()
      .int()
      .optional()
      .describe(
        'The new zero-based position of the sheet; other sheets shift around it. Moving later in the list, the index is interpreted after the removal, so to move a sheet one slot right add 2.',
      ),
    hidden: z.boolean().optional().describe('True to hide the sheet in the UI, false to show it.'),
    tabColorStyle: ColorStyle.optional().describe('The color of the sheet tab in the UI.'),
    gridProperties: GridProperties.optional().describe(
      'Grid dimensions and frozen row/column counts; only the subfields provided are updated.',
    ),
  }),
  /** The update reply is empty; we confirm the ids and the mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    sheetId: z.number().int().describe('The ID of the updated sheet.'),
    updatedFields: z
      .string()
      .describe('The field mask that was applied, one path per property provided.'),
  }),
};
