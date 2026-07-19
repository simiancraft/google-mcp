import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    trimWhitespace: { range: forGoogle(args.range) },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    cellsChangedCount: reply.trimWhitespace?.cellsChangedCount ?? 0,
  };
}
