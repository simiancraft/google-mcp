import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectFile, TOOL_FILE_FIELDS } from '../../lib/file.js';
import type { schema } from './schema.js';

/** The MCP orderBy vocabulary mapped onto REST `orderBy`, most recent first. */
const orderings = {
  recency: 'recency desc',
  lastModified: 'modifiedTime desc',
  lastModifiedByMe: 'modifiedByMeTime desc',
} as const;

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.files.list(
    forGoogle({
      orderBy: orderings[args.orderBy ?? 'recency'],
      pageSize: args.pageSize ?? 10,
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
