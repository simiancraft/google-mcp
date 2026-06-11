import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

export const schema = {
  input: z.strictObject({
    filterId: z.string().describe('The id of the filter to retrieve.'),
  }),
  output: Filter,
};
