import { z } from 'zod';
import { Filter } from '../../entities/Filter.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/list */
export const input = z.object({});

export const output = z.object({
  filters: z.array(Filter),
});
