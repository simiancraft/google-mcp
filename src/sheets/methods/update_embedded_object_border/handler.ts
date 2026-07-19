import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toEmbeddedObjectBorder } from '../../lib/charts.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths(args.border);
  if (fields === '') {
    throw new Error('Provide at least one embedded object border field to update: colorStyle.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateEmbeddedObjectBorder: {
      objectId: args.objectId,
      border: toEmbeddedObjectBorder(args.border),
      fields,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    objectId: args.objectId,
    updatedFields: fields,
  };
}
