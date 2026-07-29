import { z } from 'zod';
import { SpreadsheetProperties } from '../../entities/SpreadsheetProperties.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to update.'),
    title: SpreadsheetProperties.shape.title,
    locale: SpreadsheetProperties.shape.locale,
    timeZone: SpreadsheetProperties.shape.timeZone,
    autoRecalc: SpreadsheetProperties.shape.autoRecalc,
  }),
  /** The update reply is empty; we confirm the id and the mask applied. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    updatedFields: z
      .string()
      .describe('The field mask that was applied, one path per property provided.'),
  }),
};
