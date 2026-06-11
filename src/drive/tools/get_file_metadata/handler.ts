import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { projectFile, TOOL_FILE_FIELDS } from '../../lib/file.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.files.get({
    fileId: args.fileId,
    fields: TOOL_FILE_FIELDS,
    supportsAllDrives: true,
  });
  return projectFile(data);
}
