import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectFile, TOOL_FILE_FIELDS } from '../../lib/file.js';
import { translateQuery } from '../../lib/query.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.files.list(
    forGoogle({
      q: translateQuery(args.query),
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      fields: `nextPageToken,files(${TOOL_FILE_FIELDS})`,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    }),
  );
  return {
    files: (data.files ?? []).map(projectFile),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
