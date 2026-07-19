import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    updateConditionalFormatRule: {
      sheetId: args.sheetId,
      index: args.index,
      newIndex: args.newIndex,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    oldIndex: reply.updateConditionalFormatRule?.oldIndex ?? args.index,
    newIndex: reply.updateConditionalFormatRule?.newIndex ?? args.newIndex,
  };
}
