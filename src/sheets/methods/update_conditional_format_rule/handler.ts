import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import { toConditionalFormatRule } from '../../lib/rules.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    updateConditionalFormatRule: {
      index: args.index,
      rule: toConditionalFormatRule(args.rule),
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    index: reply.updateConditionalFormatRule?.oldIndex ?? args.index,
  };
}
