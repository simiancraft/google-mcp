import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.strictObject({
    pageSize: z
      .number()
      .int()
      .optional()
      .describe('Maximum number of shared drives to return per page.'),
    pageToken: z.string().optional().describe('Page token for shared drives.'),
    q: z.string().optional().describe('Query string for searching shared drives.'),
    useDomainAdminAccess: z
      .boolean()
      .optional()
      .describe(
        'Issue the request as a domain administrator; if set to true, then all shared ' +
          'drives of the domain in which the requester is an administrator are returned.',
      ),
  }),
  output: z.object({
    drives: z.array(SharedDrive).describe('The list of shared drives.'),
    nextPageToken: z
      .string()
      .optional()
      .describe(
        'The page token for the next page of shared drives. This will be absent if the end ' +
          'of the list has been reached.',
      ),
  }),
};
