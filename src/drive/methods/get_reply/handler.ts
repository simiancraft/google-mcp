import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectReply, REPLY_FIELDS } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.replies.get(
    forGoogle({
      fileId: args.fileId,
      commentId: args.commentId,
      replyId: args.replyId,
      includeDeleted: args.includeDeleted,
      fields: REPLY_FIELDS,
    }),
  );
  return projectReply(data);
}
