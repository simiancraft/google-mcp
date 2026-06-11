import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await drive.revisions.delete({ fileId: args.fileId, revisionId: args.revisionId });
  return { fileId: args.fileId, revisionId: args.revisionId };
}
