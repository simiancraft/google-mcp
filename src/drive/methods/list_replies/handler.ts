import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectReply, REPLY_FIELDS } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.replies.list(
    forGoogle({
      fileId: args.fileId,
      commentId: args.commentId,
      includeDeleted: args.includeDeleted,
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      fields: `nextPageToken,replies(${REPLY_FIELDS})`,
    }),
  );
  return {
    replies: (data.replies ?? []).map(projectReply),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
