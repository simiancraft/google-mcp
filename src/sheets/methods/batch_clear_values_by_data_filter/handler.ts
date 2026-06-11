import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toGoogleDataFilter } from '../../lib/filters.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.batchClearByDataFilter({
    spreadsheetId: args.spreadsheetId,
    requestBody: { dataFilters: args.dataFilters.map(toGoogleDataFilter) },
  });
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    clearedRanges: data.clearedRanges ?? undefined,
  };
}
