import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toDimensionProperties, toDimensionRange } from '../../lib/layout.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths(args.properties);
  if (fields === '') {
    throw new Error(
      'Provide at least one dimension property to update: pixelSize or hiddenByUser.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateDimensionProperties: {
      range: toDimensionRange(args.range),
      properties: toDimensionProperties(args.properties),
      fields,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    range: args.range,
    properties: args.properties,
    updatedFields: fields,
  };
}
