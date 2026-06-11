import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

export const schema = {
  input: z.object({}),
  output: z.object({
    filters: z.array(Filter),
  }),
};
