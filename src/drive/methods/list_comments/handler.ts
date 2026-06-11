import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { COMMENT_FIELDS, projectComment } from '../../lib/comment.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.comments.list(
    forGoogle({
      fileId: args.fileId,
      includeDeleted: args.includeDeleted,
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      startModifiedTime: args.startModifiedTime,
      fields: `nextPageToken,comments(${COMMENT_FIELDS})`,
    }),
  );
  return {
    comments: (data.comments ?? []).map(projectComment),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
