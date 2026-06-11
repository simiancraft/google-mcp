import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    query: z
      .string()
      .describe(
        'The search query, as `query_term operator values` clauses combined with and, or, ' +
          "not, and parentheses; string values take single quotes with embedded quotes escaped as \\'. " +
          'Supported terms: title (contains, =, !=), fullText (contains), mimeType (contains, =, !=), ' +
          'modifiedTime, viewedByMeTime, createdTime (<=, <, =, !=, >, >=; RFC 3339 UTC), ' +
          "parentId (=, !=; use 'root' for My Drive), owner (=, !=; use 'me' for the requesting user), " +
          'sharedWithMe (=, !=; true or false).',
      ),
    pageToken: z.string().optional().describe('The page token to use for pagination.'),
    pageSize: z.number().int().optional().describe('The maximum number of files to return.'),
    excludeContentSnippets: z
      .boolean()
      .optional()
      .describe(
        'If true, the content snippet will be excluded from the response. Accepted for contract ' +
          'fidelity; this server never produces snippets (the REST API serves none), so there is ' +
          'nothing to exclude either way.',
      ),
  }),
  output: z.object({
    files: z.array(File).describe('The list of files.'),
    nextPageToken: z.string().optional().describe('The next page token.'),
  }),
};
