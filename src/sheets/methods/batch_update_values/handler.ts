import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectUpdateValuesResponse } from '../../lib/values.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: args.spreadsheetId,
    requestBody: forGoogle({
      valueInputOption: args.valueInputOption,
      data: args.data.map((valueRange) => forGoogle(valueRange)),
      includeValuesInResponse: args.includeValuesInResponse,
      responseValueRenderOption: args.responseValueRenderOption,
      responseDateTimeRenderOption: args.responseDateTimeRenderOption,
    }),
  });
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    totalUpdatedRows: data.totalUpdatedRows ?? undefined,
    totalUpdatedColumns: data.totalUpdatedColumns ?? undefined,
    totalUpdatedCells: data.totalUpdatedCells ?? undefined,
    totalUpdatedSheets: data.totalUpdatedSheets ?? undefined,
    responses: (data.responses ?? []).map(projectUpdateValuesResponse),
  };
}
