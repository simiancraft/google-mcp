import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectSheetProperties } from '../../lib/spreadsheet.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.sheets.copyTo({
    spreadsheetId: args.spreadsheetId,
    sheetId: args.sheetId,
    requestBody: { destinationSpreadsheetId: args.destinationSpreadsheetId },
  });
  return projectSheetProperties(data);
}
