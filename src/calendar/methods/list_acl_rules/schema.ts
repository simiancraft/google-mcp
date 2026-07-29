import { z } from 'zod';
import { AclRule } from '../../entities/AclRule.js';

/**
 * The response's nextSyncToken is intentionally not surfaced; incremental
 * sync is deferred (issue #21), and with it the syncToken request parameter.
 */
export const schema = {
  input: z.strictObject({
    calendarId: z
      .string()
      .optional()
      .describe(
        "The calendar ID whose access control rules to list. The default is the user's primary calendar.",
      ),
    maxResults: z
      .number()
      .int()
      .max(250)
      .optional()
      .describe('Maximum number of rules returned on one result page (default 100, max 250).'),
    pageToken: z.string().optional().describe('Token specifying which result page to return.'),
    showDeleted: z
      .boolean()
      .optional()
      .describe(
        'Whether to include deleted rules in the result. Deleted rules are represented by a role of none. The default is false.',
      ),
  }),
  output: z.object({
    rules: z.array(AclRule).describe("The rules on the calendar's access control list."),
    nextPageToken: z
      .string()
      .optional()
      .describe('Token used to access the next page of this result.'),
  }),
};
