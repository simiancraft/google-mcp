import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  await applyRequest(sheets, args.spreadsheetId, {
    setDataValidation: forGoogle({
      range: forGoogle(args.range),
      filteredRowsIncluded: args.filteredRowsIncluded,
    }),
  });
  return { spreadsheetId: args.spreadsheetId };
}
