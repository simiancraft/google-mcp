import { z } from 'zod';

/**
 * A shared drive: a Drive space owned by an organization rather than an
 * individual, whose top-level folder shares the drive's ID. The REST resource
 * is named `drives`; the wing says "shared drive" (Google's prose noun) so a
 * wire name like delete_shared_drive cannot be misread as something
 * account-wide.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/manage-shareddrives
 */
export const SharedDrive = z.object({
  id: z
    .string()
    .describe(
      'Output only. The ID of this shared drive which is also the ID of the top level ' +
        'folder of this shared drive.',
    ),
  name: z.string().optional().describe('The name of this shared drive.'),
  colorRgb: z
    .string()
    .optional()
    .describe(
      'The color of this shared drive as an RGB hex string. It can only be set on a ' +
        'drives.update request that does not set themeId.',
    ),
  themeId: z
    .string()
    .optional()
    .describe(
      'The ID of the theme from which the background image and color will be set. The set ' +
        'of possible driveThemes can be retrieved from a get_about response.',
    ),
  backgroundImageLink: z
    .string()
    .optional()
    .describe("Output only. A short-lived link to this shared drive's background image."),
  createdTime: z
    .string()
    .optional()
    .describe('The time at which the shared drive was created (RFC 3339 date-time).'),
  hidden: z.boolean().optional().describe('Whether the shared drive is hidden from default view.'),
  restrictions: z
    .object({
      adminManagedRestrictions: z
        .boolean()
        .optional()
        .describe(
          'Whether administrative privileges on this shared drive are required to modify restrictions.',
        ),
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
        .describe('Whether access to items inside this shared drive is restricted to its members.'),
      sharingFoldersRequiresOrganizerPermission: z
        .boolean()
        .optional()
        .describe(
          'If true, only users with the organizer role can share folders. If false, users ' +
            'with either the organizer role or the file organizer role can share folders.',
        ),
    })
    .optional()
    .describe('A set of restrictions that apply to this shared drive or items inside it.'),
});

export type SharedDrive = z.infer<typeof SharedDrive>;
