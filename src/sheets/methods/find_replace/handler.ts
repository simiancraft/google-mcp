import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const scopes = [args.range, args.sheetId, args.allSheets].filter((value) => value !== undefined);
  if (scopes.length !== 1) {
    throw new Error('Provide exactly one of range, sheetId, or allSheets.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    findReplace: forGoogle({
      find: args.find,
      replacement: args.replacement,
      matchCase: args.matchCase,
      matchEntireCell: args.matchEntireCell,
      searchByRegex: args.searchByRegex,
      includeFormulas: args.includeFormulas,
      range: args.range ? forGoogle(args.range) : undefined,
      sheetId: args.sheetId,
      allSheets: args.allSheets,
    }),
  });
  const result = reply.findReplace ?? {};
  return {
    spreadsheetId: args.spreadsheetId,
    valuesChanged: result.valuesChanged ?? 0,
    formulasChanged: result.formulasChanged ?? 0,
    rowsChanged: result.rowsChanged ?? 0,
    sheetsChanged: result.sheetsChanged ?? 0,
    occurrencesChanged: result.occurrencesChanged ?? 0,
  };
}
