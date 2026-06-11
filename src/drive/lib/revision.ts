import type { drive_v3 } from '@googleapis/drive';
import type { Revision } from '../entities/Revision.js';
import { projectUser } from './comment.js';

/** The `fields` selection backing the Revision projection. */
export const REVISION_FIELDS =
  'id,mimeType,modifiedTime,keepForever,published,publishAuto,publishedOutsideDomain,' +
  'publishedLink,size,originalFilename,md5Checksum,' +
  'lastModifyingUser(displayName,emailAddress,me,photoLink)';

/** Project a REST revision onto the Revision shape, cleaning nulls to undefined. */
export function projectRevision(data: drive_v3.Schema$Revision): Revision {
  return {
    id: data.id ?? '',
    mimeType: data.mimeType ?? undefined,
    modifiedTime: data.modifiedTime ?? undefined,
    keepForever: data.keepForever ?? undefined,
    published: data.published ?? undefined,
    publishAuto: data.publishAuto ?? undefined,
    publishedOutsideDomain: data.publishedOutsideDomain ?? undefined,
    publishedLink: data.publishedLink ?? undefined,
    size: data.size ?? undefined,
    originalFilename: data.originalFilename ?? undefined,
    md5Checksum: data.md5Checksum ?? undefined,
    lastModifyingUser: data.lastModifyingUser ? projectUser(data.lastModifyingUser) : undefined,
  };
}
