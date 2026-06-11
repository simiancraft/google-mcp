import { z } from 'zod';
import { Label } from '../../entities/Label.js';

export const schema = {
  input: z.object({
    labelId: z.string(),
  }),
  output: Label,
};
