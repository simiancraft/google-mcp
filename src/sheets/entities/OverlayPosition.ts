import { z } from 'zod';
import { GridCoordinate } from './GridCoordinate.js';

/**
 * Where an embedded object floats over the grid: an anchor cell plus pixel
 * offsets and size.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/other#OverlayPosition
 */
export const OverlayPosition = z.strictObject({
  anchorCell: GridCoordinate.describe('The cell the object is anchored to.'),
  offsetXPixels: z
    .number()
    .int()
    .optional()
    .describe('The horizontal offset from the anchor cell, in pixels.'),
  offsetYPixels: z
    .number()
    .int()
    .optional()
    .describe('The vertical offset from the anchor cell, in pixels.'),
  widthPixels: z.number().int().optional().describe('The width of the object, in pixels.'),
  heightPixels: z.number().int().optional().describe('The height of the object, in pixels.'),
});

export type OverlayPosition = z.infer<typeof OverlayPosition>;
