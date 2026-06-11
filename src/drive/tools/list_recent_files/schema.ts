import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.object({
    orderBy: z
      .enum(['recency', 'lastModified', 'lastModifiedByMe'])
      .optional()
      .describe(
        "The sort order for the files. recency: most recent timestamp from the file's " +
          'date-time fields; lastModified: last time the file was modified by anyone; ' +
          'lastModifiedByMe: last time the file was modified by the user. Defaults to recency.',
      ),
    pageToken: z.string().optional().describe('The page token to use for pagination.'),
    pageSize: z
      .number()
      .int()
      .optional()
      .describe('The maximum number of files to return. Defaults to 10.'),
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
