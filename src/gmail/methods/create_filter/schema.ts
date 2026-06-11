import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';
import { FilterAction } from '../../entities/FilterAction.js';
import { FilterCriteria } from '../../entities/FilterCriteria.js';

export const schema = {
  input: z.object({
    criteria: FilterCriteria,
    action: FilterAction,
  }),
  output: Filter,
};
