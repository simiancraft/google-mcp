import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  _args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // about.get requires an explicit fields selection; request exactly what the
  // About entity carries.
  const { data } = await drive.about.get({
    fields:
      'user(displayName,emailAddress,me,photoLink),' +
      'storageQuota(limit,usage,usageInDrive,usageInDriveTrash),' +
      'maxUploadSize,canCreateDrives',
  });
  return {
    user: data.user
      ? {
          displayName: data.user.displayName ?? undefined,
          emailAddress: data.user.emailAddress ?? undefined,
          me: data.user.me ?? undefined,
          photoLink: data.user.photoLink ?? undefined,
        }
      : undefined,
    storageQuota: data.storageQuota
      ? {
          limit: data.storageQuota.limit ?? undefined,
          usage: data.storageQuota.usage ?? undefined,
          usageInDrive: data.storageQuota.usageInDrive ?? undefined,
          usageInDriveTrash: data.storageQuota.usageInDriveTrash ?? undefined,
        }
      : undefined,
    maxUploadSize: data.maxUploadSize ?? undefined,
    canCreateDrives: data.canCreateDrives ?? undefined,
  };
}
