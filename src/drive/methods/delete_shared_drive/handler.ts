import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await drive.drives.delete(
    forGoogle({
      driveId: args.driveId,
      useDomainAdminAccess: args.useDomainAdminAccess,
      allowItemDeletion: args.allowItemDeletion,
    }),
  );
  return { driveId: args.driveId };
}
