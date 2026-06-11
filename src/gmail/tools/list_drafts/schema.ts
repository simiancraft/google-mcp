import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

export const schema = {
  input: z.strictObject({
    query: z.string().optional().describe('Gmail search query to filter drafts.'),
    pageSize: z
      .number()
      .int()
      .max(25)
      .optional()
      .describe(
        'Maximum drafts per page (default 10, max 25; each result is hydrated with one fetch, so the bound keeps the call count sensible).',
      ),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
  }),
  output: z.object({
    drafts: z.array(Draft).describe('The drafts on this page.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
