import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

export const schema = {
  input: z.object({
    filterId: z.string(),
  }),
  output: Filter,
};
