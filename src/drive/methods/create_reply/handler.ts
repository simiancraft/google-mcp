import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectReply, REPLY_FIELDS } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // content-or-action is a schema refine, rejected before dispatch.
  const { data } = await drive.replies.create({
    fileId: args.fileId,
    commentId: args.commentId,
    requestBody: forGoogle({ content: args.content, action: args.action }),
    fields: REPLY_FIELDS,
  });
  return projectReply(data);
}
