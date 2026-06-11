import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

export const schema = {
  input: z.object({}),
  output: z.object({
    filters: z.array(Filter).describe('All filters on the account (the REST list is unpaginated).'),
  }),
};
