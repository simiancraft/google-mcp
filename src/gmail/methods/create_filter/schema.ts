import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';
import { FilterAction } from '../../entities/FilterAction.js';
import { FilterCriteria } from '../../entities/FilterCriteria.js';

export const schema = {
  input: z.object({
    criteria: FilterCriteria.describe('The criteria a message must match.'),
    action: FilterAction.describe('The actions applied to matching messages.'),
  }),
  output: Filter,
};
