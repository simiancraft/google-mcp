import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import { projectSheetProperties } from '../../lib/spreadsheet.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    duplicateSheet: forGoogle({
      sourceSheetId: args.sourceSheetId,
      insertSheetIndex: args.insertSheetIndex,
      newSheetId: args.newSheetId,
      newSheetName: args.newSheetName,
    }),
  });
  return projectSheetProperties(reply.duplicateSheet?.properties ?? {});
}
