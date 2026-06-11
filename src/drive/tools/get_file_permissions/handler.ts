import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectPermission } from '../../lib/file.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // The documented output is a bare permission list with no page token, so the
  // handler walks every REST page rather than truncating at the first.
  const permissions: z.infer<typeof schema.output>['permissions'] = [];
  let pageToken: string | undefined;
  do {
    const { data } = await drive.permissions.list(
      forGoogle({
        fileId: args.fileId,
        fields: 'nextPageToken,permissions(role,displayName,type,emailAddress,view)',
        pageToken,
        supportsAllDrives: true,
      }),
    );
    permissions.push(...(data.permissions ?? []).map(projectPermission));
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);
  return { permissions };
}
