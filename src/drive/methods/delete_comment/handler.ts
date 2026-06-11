import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await drive.comments.delete({ fileId: args.fileId, commentId: args.commentId });
  return { fileId: args.fileId, commentId: args.commentId };
}
