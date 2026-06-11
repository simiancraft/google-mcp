import type { drive_v3 } from '@googleapis/drive';
import { narrow } from '../../lib/utils/narrow.js';
import type { File } from '../entities/File.js';
import { Permission } from '../entities/Permission.js';

/**
 * The REST `fields` selection backing the MCP toolset's `File` projection:
 * exactly what `projectFile` consumes for the toolset-published fields, so
 * tool outputs stay verbatim to the MCP pages.
 */
export const TOOL_FILE_FIELDS =
  'id,name,parents,mimeType,size,description,fileExtension,webViewLink,' +
  'sharedWithMeTime,createdTime,modifiedTime,viewedByMeTime,owners(emailAddress),' +
  'capabilities(canAddChildren)';

/**
 * The methods' superset: the toolset fields plus the REST-vocabulary flags the
 * file methods write, so a write's effect is visible in its own output.
 */
export const METHOD_FILE_FIELDS = `${TOOL_FILE_FIELDS},starred,trashed,folderColorRgb,copyRequiresWriterPermission,writersCanShare`;

/**
 * Project a REST file resource onto the File shape: `name` → `title`,
 * `parents[0]` → `parentId`, `owners[0].emailAddress` → `owner`,
 * `webViewLink` → `viewUrl`, `size` → `fileSize`,
 * `capabilities.canAddChildren` → `canAddChildren`; nulls clean to undefined.
 * `contentSnippet` is never populated: the REST API serves no snippet.
 */
export function projectFile(data: drive_v3.Schema$File): File {
  return {
    id: data.id ?? '',
    title: data.name ?? undefined,
    parentId: data.parents?.[0] ?? undefined,
    mimeType: data.mimeType ?? undefined,
    fileSize: data.size ?? undefined,
    description: data.description ?? undefined,
    fileExtension: data.fileExtension ?? undefined,
    viewUrl: data.webViewLink ?? undefined,
    sharedWithMeTime: data.sharedWithMeTime ?? undefined,
    createdTime: data.createdTime ?? undefined,
    modifiedTime: data.modifiedTime ?? undefined,
    viewedByMeTime: data.viewedByMeTime ?? undefined,
    owner: data.owners?.[0]?.emailAddress ?? undefined,
    canAddChildren: data.capabilities?.canAddChildren ?? undefined,
    starred: data.starred ?? undefined,
    trashed: data.trashed ?? undefined,
    folderColorRgb: data.folderColorRgb ?? undefined,
    copyRequiresWriterPermission: data.copyRequiresWriterPermission ?? undefined,
    writersCanShare: data.writersCanShare ?? undefined,
  };
}

/** Project a REST permission onto the Permission shape; unknown enum values drop rather than masquerade. */
export function projectPermission(data: drive_v3.Schema$Permission): Permission {
  return {
    role: narrow(data.role, Permission.shape.role.unwrap().options),
    displayName: data.displayName ?? undefined,
    type: narrow(data.type, Permission.shape.type.unwrap().options),
    emailAddress: data.emailAddress ?? undefined,
    view: narrow(data.view, Permission.shape.view.unwrap().options),
  };
}
