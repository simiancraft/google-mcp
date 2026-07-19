import { z } from 'zod';
import { SlicerSpec } from '../../entities/SlicerSpec.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the slicer.'),
    slicerId: z.number().int().min(0).describe('The ID of the slicer to update.'),
    spec: SlicerSpec.describe(
      'The slicer fields to update. This is field-masked, not a whole-spec replacement; omitted fields remain unchanged.',
    ),
  }),
  /** The update reply is empty; confirm the target and derived mask. */
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the updated spreadsheet.'),
    slicerId: z.number().int().describe('The ID of the updated slicer.'),
    updatedFields: z.string().describe('The field mask applied to the slicer spec.'),
  }),
};
