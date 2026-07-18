import { z } from 'zod';
import { OverlayPosition } from './OverlayPosition.js';

/**
 * Where an embedded object lives: floating over the grid at an overlay
 * position, or alone on its own new sheet. Provide exactly one of the two
 * fields.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#EmbeddedObjectPosition
 */
export const EmbeddedObjectPosition = z.strictObject({
  overlayPosition: OverlayPosition.optional().describe(
    'The position the object floats at, over the grid.',
  ),
  newSheet: z
    .boolean()
    .optional()
    .describe('True to put the object on its own new sheet; the sheet ID is chosen by Google.'),
});

export type EmbeddedObjectPosition = z.infer<typeof EmbeddedObjectPosition>;
