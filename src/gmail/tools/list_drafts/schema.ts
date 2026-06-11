import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

export const schema = {
  input: z.object({
    query: z.string().optional(),
    /** Each result is hydrated with one fetch; bounded to keep the call count sensible. */
    pageSize: z.number().int().max(25).optional(),
    pageToken: z.string().optional(),
  }),
  output: z.object({
    drafts: z.array(Draft),
    nextPageToken: z.string().optional(),
  }),
};
