import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import { toSlicerSpec } from '../../lib/slicers.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths(args.spec, ['dataRange', 'filterCriteria', 'textFormat']);
  if (fields === '') {
    throw new Error('Provide at least one slicer spec field to update.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateSlicerSpec: {
      slicerId: args.slicerId,
      spec: toSlicerSpec(args.spec),
      fields,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    slicerId: args.slicerId,
    updatedFields: fields,
  };
}
