import { z } from 'zod';
import { Thread } from '../../entities/Thread.js';

export const schema = {
  input: z.object({
    query: z
      .string()
      .optional()
      .describe('Gmail search query (the same syntax as the Gmail search box).'),
    pageSize: z
      .number()
      .int()
      .max(50)
      .optional()
      .describe('Maximum threads per page (default 20, max 50).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
    includeTrash: z.boolean().optional().describe('Include threads from SPAM and TRASH.'),
  }),
  output: z.object({
    threads: z.array(Thread).describe('The threads matching the query.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
