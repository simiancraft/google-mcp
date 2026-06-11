import { z } from 'zod';

export const schema = {
  input: z.strictObject({
    driveId: z.string().describe('The ID of the shared drive to permanently delete.'),
    useDomainAdminAccess: z
      .boolean()
      .optional()
      .describe(
        'Issue the request as a domain administrator; if set to true, then the requester ' +
          'will be granted access if they are an administrator of the domain to which the ' +
          'shared drive belongs.',
      ),
    allowItemDeletion: z
      .boolean()
      .optional()
      .describe(
        'Whether any items inside the shared drive should also be deleted. This option is ' +
          'only supported when useDomainAdminAccess is also set to true.',
      ),
  }),
  /** Delete returns no body; we confirm the id. */
  output: z.object({
    driveId: z.string().describe('The ID of the permanently deleted shared drive.'),
  }),
};
