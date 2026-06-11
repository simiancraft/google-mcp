import { z } from 'zod';
import { User } from './User.js';

/**
 * Information about the user, the user's Drive, and system capabilities,
 * served by `about.get`. For users in an organization with pooled storage,
 * the quota describes the organization rather than the individual.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/user-info
 */
export const About = z.object({
  user: User.optional().describe('The authenticated user.'),
  storageQuota: z
    .object({
      limit: z
        .string()
        .optional()
        .describe(
          'The usage limit, if applicable. This will not be present if the user has ' +
            'unlimited storage.',
        ),
      usage: z.string().optional().describe('The total usage across all services.'),
      usageInDrive: z.string().optional().describe('The usage by all files in Google Drive.'),
      usageInDriveTrash: z
        .string()
        .optional()
        .describe('The usage by trashed files in Google Drive.'),
    })
    .optional()
    .describe("The user's storage quota limits and usage. All fields are measured in bytes."),
  maxUploadSize: z.string().optional().describe('The maximum upload size in bytes.'),
  canCreateDrives: z.boolean().optional().describe('Whether the user can create shared drives.'),
});

export type About = z.infer<typeof About>;
