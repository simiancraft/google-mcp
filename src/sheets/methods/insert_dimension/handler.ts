import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.range.endIndex <= args.range.startIndex) {
    throw new Error(
      'range.endIndex must be greater than range.startIndex; the count inserted is endIndex - startIndex.',
    );
  }
  if (args.inheritFromBefore === true && args.range.startIndex === 0) {
    throw new Error(
      'inheritFromBefore cannot be true when startIndex is 0; there is no dimension before the first.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    insertDimension: forGoogle({
      range: forGoogle(args.range),
      inheritFromBefore: args.inheritFromBefore,
    }),
  });
  return { spreadsheetId: args.spreadsheetId };
}
