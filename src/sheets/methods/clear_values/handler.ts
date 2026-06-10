import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.clear({
    spreadsheetId: args.spreadsheetId,
    range: args.range,
    requestBody: {},
  });
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    clearedRange: data.clearedRange ?? undefined,
  };
}
