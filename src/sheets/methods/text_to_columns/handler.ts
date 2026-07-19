import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.source.endColumnIndex - args.source.startColumnIndex !== 1) {
    throw new Error('source must span exactly one column.');
  }
  if ((args.delimiterType === 'CUSTOM') !== (args.delimiter !== undefined)) {
    throw new Error('Provide delimiter exactly when delimiterType is CUSTOM.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    textToColumns: forGoogle({
      source: forGoogle(args.source),
      delimiter: args.delimiter,
      delimiterType: args.delimiterType,
    }),
  });
  return { spreadsheetId: args.spreadsheetId };
}
