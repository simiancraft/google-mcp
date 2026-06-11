import { z } from 'zod';
import { Message } from '../../entities/Message.js';

export const schema = {
  input: z.strictObject({
    query: z
      .string()
      .optional()
      .describe('Gmail search query (the same syntax as the Gmail search box).'),
    pageSize: z
      .number()
      .int()
      .max(25)
      .optional()
      .describe(
        'Maximum messages per page (default 10, max 25; each result is hydrated with one fetch, so the bound keeps the call count sensible).',
      ),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
    includeTrash: z.boolean().optional().describe('Include messages from SPAM and TRASH.'),
  }),
  output: z.object({
    messages: z.array(Message).describe('The messages matching the query.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
