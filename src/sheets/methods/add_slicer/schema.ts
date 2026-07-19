import { z } from 'zod';
import { EmbeddedObjectPosition } from '../../entities/EmbeddedObjectPosition.js';
import { Slicer } from '../../entities/Slicer.js';
import { SlicerSpec } from '../../entities/SlicerSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to add the slicer to.'),
    slicerId: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe('An ID to assign; it must not already be used. Omitted, Google generates one.'),
    spec: SlicerSpec.describe('The data, criteria, and presentation of the slicer.'),
    position: EmbeddedObjectPosition.describe(
      'Where the slicer floats on an existing sheet. Provide only overlayPosition, including anchorCell; object sheets are not supported for slicers.',
    ),
  }),
  output: Slicer,
};
