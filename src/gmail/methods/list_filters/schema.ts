import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/list */
export const schema = {
  input: z.object({}),
  output: z.object({
    filters: z.array(Filter),
  }),
};
