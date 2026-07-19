import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await applyRequest(sheets, args.spreadsheetId, {
    appendDimension: {
      sheetId: args.sheetId,
      dimension: args.dimension,
      length: args.length,
    },
  });
  return { spreadsheetId: args.spreadsheetId };
}
