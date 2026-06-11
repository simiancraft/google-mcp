import { z } from 'zod';
import { Label } from '../../entities/Label.js';
import { LabelColor } from '../../entities/LabelColor.js';

export const schema = {
  input: z.object({
    displayName: z.string().describe('The display name of the new label.'),
    color: LabelColor.optional().describe('Text and background colors for the label.'),
  }),
  output: Label,
};
