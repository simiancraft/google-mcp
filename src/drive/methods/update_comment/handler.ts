import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { COMMENT_FIELDS, projectComment } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.comments.update({
    fileId: args.fileId,
    commentId: args.commentId,
    requestBody: { content: args.content },
    fields: COMMENT_FIELDS,
  });
  return projectComment(data);
}
