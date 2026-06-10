import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectSpreadsheet } from '../../lib/spreadsheet.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.create({
    requestBody: forGoogle({
      properties: forGoogle({
        title: args.title,
        locale: args.locale,
        timeZone: args.timeZone,
      }),
      sheets: args.sheets?.map((sheet) => ({ properties: { title: sheet.title } })),
    }),
  });
  return projectSpreadsheet(data);
}
