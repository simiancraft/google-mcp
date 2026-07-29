import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.comparisonColumns?.some((column) => column.dimension !== 'COLUMNS')) {
    throw new Error('Every comparisonColumns entry must use dimension COLUMNS.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    deleteDuplicates: forGoogle({
      range: forGoogle(args.range),
      comparisonColumns: args.comparisonColumns
        ? args.comparisonColumns.map((column) => forGoogle(column))
        : undefined,
    }),
  });
  return {
    spreadsheetId: args.spreadsheetId,
    duplicatesRemovedCount: reply.deleteDuplicates?.duplicatesRemovedCount ?? 0,
  };
}
