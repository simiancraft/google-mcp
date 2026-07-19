import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { cellFieldPaths, toCellData } from '../../lib/cells.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.start === undefined) === (args.range === undefined)) {
    throw new Error('Provide exactly one of start or range.');
  }
  const fields = cellFieldPaths(args.rows);
  if (fields === '') {
    throw new Error(
      'Provide at least one cell field to write: userEnteredValue, note, userEnteredFormat, or textFormatRuns.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateCells: forGoogle({
      start: args.start,
      range: args.range ? forGoogle(args.range) : undefined,
      rows: args.rows.map((row) => ({ values: row.values.map(toCellData) })),
      fields,
    }),
  });
  return { spreadsheetId: args.spreadsheetId, updatedFields: fields };
}
