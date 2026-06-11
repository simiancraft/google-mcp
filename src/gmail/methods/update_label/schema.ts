import { z } from 'zod';
import { Label } from '../../entities/Label.js';
import { LabelColor } from '../../entities/LabelColor.js';

export const schema = {
  input: z.object({
    labelId: z.string().describe('The id of the user label to update.'),
    name: z.string().optional().describe('New display name.'),
    color: LabelColor.optional().describe('New text and background colors.'),
  }),
  output: Label,
};
