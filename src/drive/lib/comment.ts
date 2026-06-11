import type { drive_v3 } from '@googleapis/drive';
import { narrow } from '../../lib/enums.js';
import type { Comment } from '../entities/Comment.js';
import { Reply } from '../entities/Reply.js';
import type { User } from '../entities/User.js';

/** The `fields` selection backing the User projection (authors, last-modifying users). */
export const USER_FIELDS = 'displayName,emailAddress,me,photoLink';

/** The `fields` selection backing the Reply projection. */
export const REPLY_FIELDS = `id,content,htmlContent,author(${USER_FIELDS}),createdTime,modifiedTime,deleted,action`;

/** The `fields` selection backing the Comment projection (replies included). */
export const COMMENT_FIELDS =
  `id,content,htmlContent,author(${USER_FIELDS}),createdTime,modifiedTime,resolved,deleted,` +
  `anchor,quotedFileContent(mimeType,value),replies(${REPLY_FIELDS})`;

/** Project a REST user onto the User shape, cleaning nulls to undefined. */
export function projectUser(data: drive_v3.Schema$User): User {
  return {
    displayName: data.displayName ?? undefined,
    emailAddress: data.emailAddress ?? undefined,
    me: data.me ?? undefined,
    photoLink: data.photoLink ?? undefined,
  };
}

/** Project a REST reply onto the Reply shape; unknown actions drop rather than masquerade. */
export function projectReply(data: drive_v3.Schema$Reply): Reply {
  return {
    id: data.id ?? '',
    content: data.content ?? undefined,
    htmlContent: data.htmlContent ?? undefined,
    author: data.author ? projectUser(data.author) : undefined,
    createdTime: data.createdTime ?? undefined,
    modifiedTime: data.modifiedTime ?? undefined,
    deleted: data.deleted ?? undefined,
    action: narrow(data.action, Reply.shape.action.unwrap().options),
  };
}

/** Project a REST comment onto the Comment shape, replies included. */
export function projectComment(data: drive_v3.Schema$Comment): Comment {
  return {
    id: data.id ?? '',
    content: data.content ?? undefined,
    htmlContent: data.htmlContent ?? undefined,
    author: data.author ? projectUser(data.author) : undefined,
    createdTime: data.createdTime ?? undefined,
    modifiedTime: data.modifiedTime ?? undefined,
    resolved: data.resolved ?? undefined,
    deleted: data.deleted ?? undefined,
    anchor: data.anchor ?? undefined,
    quotedFileContent: data.quotedFileContent
      ? {
          mimeType: data.quotedFileContent.mimeType ?? undefined,
          value: data.quotedFileContent.value ?? undefined,
        }
      : undefined,
    replies: data.replies ? data.replies.map(projectReply) : undefined,
  };
}
