import { z } from 'zod';
import { EmbeddedObjectPosition } from '../../entities/EmbeddedObjectPosition.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the object.'),
    objectId: z.number().int().min(0).describe('The ID of the embedded object to move or resize.'),
    newPosition: EmbeddedObjectPosition.describe(
      'The new position. Provide exactly one of overlayPosition, sheetId for a new object sheet with that ID, or newSheet: true for a new object sheet with a generated ID. An overlayPosition needs at least one field; omitted overlay fields stay unchanged.',
    ),
  }),
  output: EmbeddedObjectPosition.describe('The new position returned by Google.'),
};
