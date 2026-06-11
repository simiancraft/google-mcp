import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectValueRange } from '../../lib/values.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.values.batchGet(
    forGoogle({
      spreadsheetId: args.spreadsheetId,
      ranges: args.ranges,
      majorDimension: args.majorDimension,
      valueRenderOption: args.valueRenderOption,
      dateTimeRenderOption: args.dateTimeRenderOption,
    }),
  );
  return {
    spreadsheetId: data.spreadsheetId ?? args.spreadsheetId,
    valueRanges: (data.valueRanges ?? []).map(projectValueRange),
  };
}
