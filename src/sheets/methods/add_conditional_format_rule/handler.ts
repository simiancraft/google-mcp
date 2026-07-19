import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import { toConditionalFormatRule } from '../../lib/rules.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await applyRequest(sheets, args.spreadsheetId, {
    addConditionalFormatRule: forGoogle({
      rule: toConditionalFormatRule(args.rule),
      index: args.index,
    }),
  });
  return { spreadsheetId: args.spreadsheetId, index: args.index ?? 0 };
}
