import { z } from 'zod';
import { SharedDrive } from '../../entities/SharedDrive.js';

export const schema = {
  input: z.strictObject({
    driveId: z.string().describe('The ID of the shared drive.'),
    name: z.string().optional().describe('The name to set on this shared drive.'),
    colorRgb: z
      .string()
      .optional()
      .describe(
        'The color of this shared drive as an RGB hex string. It can only be set on a ' +
          'request that does not set themeId.',
      ),
    themeId: z
      .string()
      .optional()
      .describe(
        'The ID of the theme from which the background image and color will be set. The set ' +
          'of possible driveThemes can be retrieved from a get_about response.',
      ),
    restrictions: z
      .strictObject({
        adminManagedRestrictions: z
          .boolean()
          .optional()
          .describe('Whether administrative privileges are required to modify restrictions.'),
        copyRequiresWriterPermission: z
          .boolean()
          .optional()
          .describe(
            'Whether the options to copy, print, or download files inside this shared drive ' +
              'should be disabled for readers and commenters.',
          ),
        domainUsersOnly: z
          .boolean()
          .optional()
          .describe(
            'Whether access to this shared drive and items inside it is restricted to users ' +
              'of the domain to which this shared drive belongs.',
          ),
        driveMembersOnly: z
          .boolean()
          .optional()
          .describe(
            'Whether access to items inside this shared drive is restricted to its members.',
          ),
        sharingFoldersRequiresOrganizerPermission: z
          .boolean()
          .optional()
          .describe('If true, only users with the organizer role can share folders.'),
      })
      .optional()
      .describe('Restrictions to set on this shared drive.'),
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
