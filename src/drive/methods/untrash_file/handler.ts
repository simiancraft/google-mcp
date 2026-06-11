import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { METHOD_FILE_FIELDS, projectFile } from '../../lib/file.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.files.update({
    fileId: args.fileId,
    requestBody: { trashed: false },
    fields: METHOD_FILE_FIELDS,
    supportsAllDrives: true,
  });
  return projectFile(data);
}
