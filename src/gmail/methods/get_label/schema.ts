import { z } from 'zod';
import { Label } from '../../entities/Label.js';

export const schema = {
  input: z.object({
    labelId: z.string().describe('The id of the label to retrieve.'),
  }),
  output: Label,
};
