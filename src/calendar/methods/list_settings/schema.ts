import { z } from 'zod';
import { Setting } from '../../entities/Setting.js';

/**
 * The response's nextSyncToken is intentionally not surfaced; incremental
 * sync is deferred (issue #21).
 */
export const schema = {
  input: z.strictObject({
    maxResults: z
      .number()
      .int()
      .max(250)
      .optional()
      .describe('Maximum number of settings returned on one result page (default 100, max 250).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
  }),
  output: z.object({
    settings: z.array(Setting).describe('The user settings.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
