import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest, toColorStyle } from '../../lib/requests.js';
import { projectSheetProperties } from '../../lib/spreadsheet.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addSheet: {
      properties: forGoogle({
        title: args.title,
        index: args.index,
        hidden: args.hidden,
        tabColorStyle: args.tabColorStyle ? toColorStyle(args.tabColorStyle) : undefined,
        gridProperties: args.gridProperties ? forGoogle(args.gridProperties) : undefined,
      }),
    },
  });
  return projectSheetProperties(reply.addSheet?.properties ?? {});
}
