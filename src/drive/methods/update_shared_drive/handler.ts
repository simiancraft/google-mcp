import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectSharedDrive, SHARED_DRIVE_FIELDS } from '../../lib/shared-drive.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.drives.update(
    forGoogle({
      driveId: args.driveId,
      useDomainAdminAccess: args.useDomainAdminAccess,
      requestBody: forGoogle({
        name: args.name,
        colorRgb: args.colorRgb,
        themeId: args.themeId,
        restrictions: args.restrictions ? forGoogle(args.restrictions) : undefined,
      }),
      fields: SHARED_DRIVE_FIELDS,
    }),
  );
  return projectSharedDrive(data);
}
