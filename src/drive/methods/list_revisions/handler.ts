import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectRevision, REVISION_FIELDS } from '../../lib/revision.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.revisions.list(
    forGoogle({
      fileId: args.fileId,
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      fields: `nextPageToken,revisions(${REVISION_FIELDS})`,
    }),
  );
  return {
    revisions: (data.revisions ?? []).map(projectRevision),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
