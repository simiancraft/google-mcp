import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await drive.replies.delete({
    fileId: args.fileId,
    commentId: args.commentId,
    replyId: args.replyId,
  });
  return { fileId: args.fileId, commentId: args.commentId, replyId: args.replyId };
}
