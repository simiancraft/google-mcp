import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await applyRequest(sheets, args.spreadsheetId, {
    deleteConditionalFormatRule: { sheetId: args.sheetId, index: args.index },
  });
  return { spreadsheetId: args.spreadsheetId, index: args.index };
}
