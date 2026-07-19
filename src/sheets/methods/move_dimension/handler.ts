import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toDimensionRange } from '../../lib/layout.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.source.endIndex <= args.source.startIndex) {
    throw new Error('source.endIndex must be greater than source.startIndex.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    moveDimension: {
      source: toDimensionRange(args.source),
      destinationIndex: args.destinationIndex,
    },
  });
  return { spreadsheetId: args.spreadsheetId };
}
