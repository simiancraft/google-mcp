import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectEmbeddedObjectPosition, toEmbeddedObjectPosition } from '../../lib/charts.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const locationCount = [
    args.newPosition.overlayPosition,
    args.newPosition.sheetId,
    args.newPosition.newSheet,
  ].filter((location) => location !== undefined).length;
  if (locationCount !== 1) {
    throw new Error(
      'Provide exactly one of newPosition.overlayPosition, newPosition.sheetId, or newPosition.newSheet: true.',
    );
  }
  const fields = args.newPosition.overlayPosition
    ? fieldPaths(args.newPosition.overlayPosition)
    : undefined;
  if (fields === '') {
    throw new Error('Provide at least one newPosition.overlayPosition field to update.');
  }
  const update: sheets_v4.Schema$UpdateEmbeddedObjectPositionRequest = {
    objectId: args.objectId,
    newPosition: toEmbeddedObjectPosition(args.newPosition),
    ...(fields === undefined ? {} : { fields }),
  };
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    updateEmbeddedObjectPosition: update,
  });
  const position = reply.updateEmbeddedObjectPosition?.position;
  if (!position) {
    throw new Error(
      'Google returned no position for the embedded object update; the resulting position is unknown.',
    );
  }
  return projectEmbeddedObjectPosition(position);
}
