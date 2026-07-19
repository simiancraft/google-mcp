import { z } from 'zod';
import { EmbeddedObjectBorder } from '../../entities/EmbeddedObjectBorder.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the object.'),
    objectId: z.number().int().min(0).describe('The ID of the embedded object to update.'),
    border: EmbeddedObjectBorder.describe(
      'The border properties to update; only provided fields change.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
    objectId: z.number().int().describe('The ID of the updated embedded object.'),
    updatedFields: z.string().describe('The field mask applied to the border.'),
  }),
};
