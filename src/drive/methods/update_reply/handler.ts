import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { projectReply, REPLY_FIELDS } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.replies.update({
    fileId: args.fileId,
    commentId: args.commentId,
    replyId: args.replyId,
    requestBody: { content: args.content },
    fields: REPLY_FIELDS,
  });
  return projectReply(data);
}
