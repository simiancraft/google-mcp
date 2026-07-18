import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest, fieldPaths, toCellFormat } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const formatPaths = fieldPaths(args.format, ['textFormat']);
  if (formatPaths === '') {
    throw new Error(
      'Provide at least one format field: numberFormat, backgroundColorStyle, textFormat, horizontalAlignment, verticalAlignment, or wrapStrategy.',
    );
  }
  const fields = formatPaths
    .split(',')
    .map((path) => `userEnteredFormat.${path}`)
    .join(',');
  await applyRequest(sheets, args.spreadsheetId, {
    repeatCell: {
      range: forGoogle(args.range),
      cell: { userEnteredFormat: toCellFormat(args.format) },
      fields,
    },
  });
  return { spreadsheetId: args.spreadsheetId, updatedFields: fields };
}
