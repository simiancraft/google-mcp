import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.object({
    driveId: z.string().describe('The ID of the shared drive.'),
    useDomainAdminAccess: z
      .boolean()
      .optional()
      .describe(
        'Issue the request as a domain administrator; if set to true, then the requester ' +
          'will be granted access if they are an administrator of the domain to which the ' +
          'shared drive belongs.',
      ),
  }),
  output: SharedDrive,
};
