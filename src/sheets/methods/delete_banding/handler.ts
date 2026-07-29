import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await applyRequest(sheets, args.spreadsheetId, {
    deleteBanding: { bandedRangeId: args.bandedRangeId },
  });
  return { spreadsheetId: args.spreadsheetId, bandedRangeId: args.bandedRangeId };
}
