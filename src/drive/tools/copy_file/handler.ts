import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectFile, TOOL_FILE_FIELDS } from '../../lib/file.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.files.copy(
    forGoogle({
      fileId: args.fileId,
      requestBody: forGoogle({
        name: args.title,
        parents: args.parentId ? [args.parentId] : undefined,
      }),
      fields: TOOL_FILE_FIELDS,
      supportsAllDrives: true,
    }),
  );
  return projectFile(data);
}
