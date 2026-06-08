import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/get */
export const schema = {
  input: z.object({
    filterId: z.string(),
  }),
  output: Filter,
};
