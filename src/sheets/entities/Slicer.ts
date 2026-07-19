import { z } from 'zod';
import { EmbeddedObjectPosition } from './EmbeddedObjectPosition.js';
import { SlicerSpec } from './SlicerSpec.js';

/**
 * A sheet-level control that filters a data range, charts, and optionally pivot
 * tables by one column's criteria.
 *
 * @see https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/sheets#Slicer
 */
export const Slicer = z.object({
  slicerId: z.number().int().min(0).describe('The ID of the slicer.'),
  spec: SlicerSpec.optional().describe('The specification of the slicer.'),
  position: EmbeddedObjectPosition.optional().describe(
    'The slicer position on an existing sheet; Google may adjust its width and height to permitted limits.',
  ),
});

export type Slicer = z.infer<typeof Slicer>;
