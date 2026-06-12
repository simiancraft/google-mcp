import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectUpdateValuesResponse } from '../../lib/values.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.append(
    forGoogle({
      spreadsheetId: args.spreadsheetId,
      range: args.range,
      valueInputOption: args.valueInputOption,
      insertDataOption: args.insertDataOption,
      includeValuesInResponse: args.includeValuesInResponse,
      responseValueRenderOption: args.responseValueRenderOption,
      responseDateTimeRenderOption: args.responseDateTimeRenderOption,
      requestBody: forGoogle({
        values: args.values,
        majorDimension: args.majorDimension,
      }),
    }),
  );
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    tableRange: data.tableRange ?? undefined,
    updates: data.updates ? projectUpdateValuesResponse(data.updates) : undefined,
  };
}
