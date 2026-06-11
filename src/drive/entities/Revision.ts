import { z } from 'zod';
import { User } from './User.js';

/**
 * A version of a file: Drive keeps a revision history for blobs and Docs
 * Editors files. Blob revisions auto-purge 30 days after newer content is
 * uploaded unless pinned with `keepForever`; the publish flags apply to Docs
 * Editors files only.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/manage-revisions
 */
export const Revision = z.object({
  id: z.string().describe('Output only. The ID of the revision.'),
  mimeType: z.string().optional().describe('Output only. The MIME type of the revision.'),
  modifiedTime: z
    .string()
    .optional()
    .describe('The last time the revision was modified (RFC 3339 date-time).'),
  keepForever: z
    .boolean()
    .optional()
    .describe(
      'Whether to keep this revision forever, even if it is no longer the head revision. ' +
        'If not set, the revision will be automatically purged 30 days after newer content ' +
        'is uploaded. Only applicable to files with binary content; only 200 revisions can ' +
        'be kept forever.',
    ),
  published: z
    .boolean()
    .optional()
    .describe('Whether this revision is published. This is only applicable to Docs Editors files.'),
  publishAuto: z
    .boolean()
    .optional()
    .describe(
      'Whether subsequent revisions will be automatically republished. This is only ' +
        'applicable to Docs Editors files.',
    ),
  publishedOutsideDomain: z
    .boolean()
    .optional()
    .describe(
      'Whether this revision is published outside the domain. This is only applicable to ' +
        'Docs Editors files.',
    ),
  publishedLink: z
    .string()
    .optional()
    .describe(
      'Output only. A link to the published revision. This is only populated for Docs ' +
        'Editors files.',
    ),
  size: z
    .string()
    .optional()
    .describe(
      "Output only. The size of the revision's content in bytes. This is only applicable " +
        'to files with binary content in Drive.',
    ),
  originalFilename: z
    .string()
    .optional()
    .describe(
      'Output only. The original filename used to create this revision. This is only ' +
        'applicable to files with binary content in Drive.',
    ),
  md5Checksum: z
    .string()
    .optional()
    .describe(
      "Output only. The MD5 checksum of the revision's content. This is only applicable " +
        'to files with binary content in Drive.',
    ),
  lastModifyingUser: User.optional().describe(
    'Output only. The last user to modify this revision. This field is only populated when ' +
      'the last modification was performed by a signed-in user.',
  ),
});

export type Revision = z.infer<typeof Revision>;
