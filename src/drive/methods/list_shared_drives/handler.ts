import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectSharedDrive, SHARED_DRIVE_FIELDS } from '../../lib/shared-drive.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.drives.list(
    forGoogle({
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      q: args.q,
      useDomainAdminAccess: args.useDomainAdminAccess,
      fields: `nextPageToken,drives(${SHARED_DRIVE_FIELDS})`,
    }),
  );
  return {
    drives: (data.drives ?? []).map(projectSharedDrive),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
