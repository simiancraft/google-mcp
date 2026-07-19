import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const fields = fieldPaths({
    title: args.title,
    locale: args.locale,
    timeZone: args.timeZone,
    autoRecalc: args.autoRecalc,
  });
  if (fields === '') {
    throw new Error(
      'Provide at least one property to update: title, locale, timeZone, or autoRecalc.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateSpreadsheetProperties: {
      properties: forGoogle({
        title: args.title,
        locale: args.locale,
        timeZone: args.timeZone,
        autoRecalc: args.autoRecalc,
      }),
      fields,
    },
  });
  return { spreadsheetId: args.spreadsheetId, updatedFields: fields };
}
