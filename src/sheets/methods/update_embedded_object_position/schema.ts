import { z } from 'zod';
import { EmbeddedObjectPosition } from '../../entities/EmbeddedObjectPosition.js';
import { OverlayPosition } from '../../entities/OverlayPosition.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the object.'),
    objectId: z.number().int().min(0).describe('The ID of the embedded object to move or resize.'),
    newPosition: z
      .strictObject({
        overlayPosition: OverlayPosition.describe(
          'The overlay position fields to update. At least one field is required; fields not provided stay unchanged.',
        ),
      })
      .describe('The new overlay position for the embedded object.'),
  }),
  output: EmbeddedObjectPosition.describe('The new position returned by Google.'),
};
