import { z } from 'zod';
import { SheetProperties } from '../../entities/SheetProperties.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the sheet.'),
    sourceSheetId: z.number().int().describe('The ID of the sheet to duplicate.'),
    insertSheetIndex: z
      .number()
      .int()
      .optional()
      .describe(
        "The zero-based position to insert the duplicate at; existing sheets shift over. Omitted, the duplicate is inserted at the source sheet's index, shifting the source right (live-verified).",
      ),
    newSheetId: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe(
        'The ID for the duplicate; must not already be in use. Omitted, Google assigns one.',
      ),
    newSheetName: z
      .string()
      .optional()
      .describe('The name of the duplicate. Omitted, Google assigns "Copy of <source name>".'),
  }),
  output: SheetProperties,
};
