import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectUpdateValuesResponse } from '../../lib/values.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.update(
    forGoogle({
      spreadsheetId: args.spreadsheetId,
      range: args.range,
      valueInputOption: args.valueInputOption,
      includeValuesInResponse: args.includeValuesInResponse,
      responseValueRenderOption: args.responseValueRenderOption,
      responseDateTimeRenderOption: args.responseDateTimeRenderOption,
      requestBody: forGoogle({
        values: args.values,
        majorDimension: args.majorDimension,
      }),
    }),
  );
  return projectUpdateValuesResponse(data);
}
