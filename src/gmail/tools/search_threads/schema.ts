import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/search_threads */
export const schema = {
  input: z.object({
    query: z.string().optional(),
    pageSize: z.number().int().max(50).optional(),
    pageToken: z.string().optional(),
    includeTrash: z.boolean().optional(),
  }),
  output: z.object({
    threads: z.array(Thread),
    nextPageToken: z.string().optional(),
  }),
};
