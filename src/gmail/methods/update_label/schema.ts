import { z } from 'zod';
import { Label } from '../../entities/Label.js';
import { LabelColor } from '../../entities/LabelColor.js';

export const schema = {
  input: z.object({
    labelId: z.string(),
    name: z.string().optional().describe('New display name.'),
    color: LabelColor.optional(),
  }),
  output: Label,
};
