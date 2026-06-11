import { z } from 'zod';

/**
 * A grant of access to a file: who (a user, group, domain, or anyone) holds
 * which role on it. The MCP toolset's projection of the REST `permissions`
 * resource; field docs use `.describe()` so they reach the wire JSON Schema
 * an MCP client reads.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/manage-sharing
 */
export const Permission = z.object({
  role: z
    .enum(['owner', 'organizer', 'fileOrganizer', 'writer', 'commenter', 'reader'])
    .optional()
    .describe(
      'The role of the grantee for the file. The possible roles include: owner, organizer, fileOrganizer, writer, commenter, reader.',
    ),
  displayName: z
    .string()
    .optional()
    .describe("Output only. The 'pretty' name of the value of the permission."),
  type: z
    .enum(['user', 'group', 'domain', 'anyone'])
    .optional()
    .describe('The type of the grantee. Supported values include: user, group, domain, anyone.'),
  emailAddress: z
    .string()
    .optional()
    .describe('The email address of the user or group to which this permission refers.'),
  view: z
    .enum(['published', 'metadata'])
    .optional()
    .describe(
      'Specifies the view to which this permission applies, if any. Supported values include: published, metadata.',
    ),
});

export type Permission = z.infer<typeof Permission>;
