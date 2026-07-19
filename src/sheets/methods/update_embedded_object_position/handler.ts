import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectEmbeddedObjectPosition, toEmbeddedObjectPosition } from '../../lib/charts.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths(args.newPosition.overlayPosition);
  if (fields === '') {
    throw new Error('Provide at least one newPosition.overlayPosition field to update.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    updateEmbeddedObjectPosition: {
      objectId: args.objectId,
      newPosition: toEmbeddedObjectPosition(args.newPosition),
      fields,
    },
  });
  const position = reply.updateEmbeddedObjectPosition?.position;
  if (!position) {
    throw new Error(
      'Google returned no position for the embedded object update; the resulting position is unknown.',
    );
  }
  return projectEmbeddedObjectPosition(position);
}
