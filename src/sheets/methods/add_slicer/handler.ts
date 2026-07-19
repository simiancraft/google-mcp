import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import { projectSlicer, toSlicer } from '../../lib/slicers.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addSlicer: {
      slicer: toSlicer({ slicerId: args.slicerId, spec: args.spec, position: args.position }),
    },
  });
  const added = reply.addSlicer?.slicer;
  if (!added) {
    throw new Error('Google returned no slicer for the add; the slicer may not have been created.');
  }
  // A generated ID of zero can be omitted from a proto3 reply.
  const slicerId = added.slicerId ?? args.slicerId ?? 0;
  return projectSlicer({ ...added, slicerId });
}
