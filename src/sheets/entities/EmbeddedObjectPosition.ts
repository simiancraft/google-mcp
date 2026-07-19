import { z } from 'zod';
import { OverlayPosition } from './OverlayPosition.js';

/**
 * Where an embedded object lives: floating over the grid at an overlay
 * position, or alone on its own sheet. Readouts use sheetId for an existing
 * object sheet; add and update writes can create an object sheet with an
 * explicit sheetId or request a generated ID with newSheet. Provide exactly
 * one location field where the operation accepts the full position.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#EmbeddedObjectPosition
 */
export const EmbeddedObjectPosition = z.strictObject({
  sheetId: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'The sheet this object is on when it has its own sheet. When adding or updating a position, this creates a new object sheet with this ID.',
    ),
  overlayPosition: OverlayPosition.optional().describe(
    'The position the object floats at, over the grid.',
  ),
  newSheet: z
    .literal(true)
    .optional()
    .describe(
      'True to put the object on its own new sheet; the sheet ID is chosen by Google. Only true is meaningful, so false is rejected.',
    ),
});

export type EmbeddedObjectPosition = z.infer<typeof EmbeddedObjectPosition>;
