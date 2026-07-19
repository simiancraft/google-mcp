import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { toColorStyle } from '../../lib/formats.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths(
    {
      title: args.title,
      index: args.index,
      hidden: args.hidden,
      tabColorStyle: args.tabColorStyle,
      gridProperties: args.gridProperties,
    },
    ['gridProperties'],
  );
  if (fields === '') {
    throw new Error(
      'Provide at least one property to update: title, index, hidden, tabColorStyle, or gridProperties.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateSheetProperties: {
      properties: forGoogle({
        sheetId: args.sheetId,
        title: args.title,
        index: args.index,
        hidden: args.hidden,
        tabColorStyle: args.tabColorStyle ? toColorStyle(args.tabColorStyle) : undefined,
        gridProperties: args.gridProperties ? forGoogle(args.gridProperties) : undefined,
      }),
      fields,
    },
  });
  return { spreadsheetId: args.spreadsheetId, sheetId: args.sheetId, updatedFields: fields };
}
