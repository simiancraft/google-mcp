import type { drive_v3 } from '@googleapis/drive';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectRevision, REVISION_FIELDS } from '../../lib/revision.js';
import type { schema } from './schema.js';

export async function handler(
  drive: drive_v3.Drive,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await drive.revisions.update({
    fileId: args.fileId,
    revisionId: args.revisionId,
    requestBody: forGoogle({
      keepForever: args.keepForever,
      published: args.published,
      publishAuto: args.publishAuto,
      publishedOutsideDomain: args.publishedOutsideDomain,
    }),
    fields: REVISION_FIELDS,
  });
  return projectRevision(data);
}
