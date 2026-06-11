import { z } from 'zod';

/**
 * A file in Drive: any content stored in Drive (a blob, a Google Workspace
 * document, a folder, or a shortcut), identified by an immutable id.
 *
 * Fields here are the MCP toolset's lossy `File` projection of the REST
 * `files` resource (`name` → `title`, `parents[0]` → `parentId`,
 * `owners[0].emailAddress` → `owner`, `webViewLink` → `viewUrl`, `size` →
 * `fileSize`, `capabilities.canAddChildren` → `canAddChildren`), plus the
 * REST-vocabulary flags the methods write (`starred`, `trashed`,
 * `folderColorRgb`, `copyRequiresWriterPermission`, `writersCanShare`). Tools
 * request only the toolset fields, so their outputs stay verbatim to the MCP
 * pages; methods request the superset so a write's effect is visible in its
 * output. Field docs use `.describe()` so they reach the wire JSON Schema an
 * MCP client reads.
 *
 * @see https://developers.google.com/workspace/drive/api/guides/about-files
 */
export const File = z.object({
  id: z.string().describe('The id of the file that was fetched.'),
  title: z.string().optional().describe('The title of the file.'),
  parentId: z.string().optional().describe('The (optional) id of the parent of the file.'),
  mimeType: z.string().optional().describe('The mime type of the file.'),
  fileSize: z.string().optional().describe('The size in bytes of the file.'),
  description: z.string().optional().describe('The description of the file.'),
  fileExtension: z
    .string()
    .optional()
    .describe(
      'The original file extension of the file, this is only populated for files with content stored in Drive.',
    ),
  contentSnippet: z
    .string()
    .optional()
    .describe(
      "Generated snippet about the content of the file. Computed by Google's hosted MCP " +
        'backend only; the Drive REST API serves no snippet, so this server never populates the field.',
    ),
  viewUrl: z.string().optional().describe('The URL to view the file.'),
  sharedWithMeTime: z
    .string()
    .optional()
    .describe('The time that the file was shared with the requester (RFC 3339 date-time).'),
  createdTime: z
    .string()
    .optional()
    .describe('The time that the file was created (RFC 3339 date-time).'),
  modifiedTime: z
    .string()
    .optional()
    .describe('The most recent time at which the file was modified (RFC 3339 date-time).'),
  viewedByMeTime: z
    .string()
    .optional()
    .describe(
      'The most recent time at which the file was viewed by requester (RFC 3339 date-time).',
    ),
  owner: z.string().optional().describe('The email address of the owner of the file.'),
  canAddChildren: z
    .boolean()
    .optional()
    .describe(
      'Whether the requester can add children to this folder. This is always false for non-folder types.',
    ),
  starred: z.boolean().optional().describe('Whether the user has starred the file.'),
  trashed: z
    .boolean()
    .optional()
    .describe(
      'Whether the file has been trashed, either explicitly or from a trashed parent folder.',
    ),
  folderColorRgb: z
    .string()
    .optional()
    .describe('The color for a folder or a shortcut to a folder as an RGB hex string.'),
  copyRequiresWriterPermission: z
    .boolean()
    .optional()
    .describe(
      'Whether the options to copy, print, or download this file should be disabled for readers and commenters.',
    ),
  writersCanShare: z
    .boolean()
    .optional()
    .describe(
      "Whether users with only writer permission can modify the file's permissions. Not populated for items in shared drives.",
    ),
});

export type File = z.infer<typeof File>;
