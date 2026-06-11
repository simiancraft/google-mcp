import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectDataFilter, toGoogleDataFilter } from '../../lib/filters.js';
import { projectValueRange } from '../../lib/values.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.batchGetByDataFilter({
    spreadsheetId: args.spreadsheetId,
    requestBody: forGoogle({
      dataFilters: args.dataFilters.map(toGoogleDataFilter),
      majorDimension: args.majorDimension,
      valueRenderOption: args.valueRenderOption,
      dateTimeRenderOption: args.dateTimeRenderOption,
    }),
  });
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    valueRanges: (data.valueRanges ?? []).map((matched) => ({
      valueRange: matched.valueRange ? projectValueRange(matched.valueRange) : undefined,
      dataFilters: matched.dataFilters ? matched.dataFilters.map(projectDataFilter) : undefined,
    })),
  };
}
