import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { toBorder } from '../../lib/formats.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const borders = {
    top: args.top ? toBorder(args.top) : undefined,
    bottom: args.bottom ? toBorder(args.bottom) : undefined,
    left: args.left ? toBorder(args.left) : undefined,
    right: args.right ? toBorder(args.right) : undefined,
    innerHorizontal: args.innerHorizontal ? toBorder(args.innerHorizontal) : undefined,
    innerVertical: args.innerVertical ? toBorder(args.innerVertical) : undefined,
  };
  if (Object.values(borders).every((border) => border === undefined)) {
    throw new Error(
      'Provide at least one border: top, bottom, left, right, innerHorizontal, or innerVertical.',
    );
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateBorders: forGoogle({ range: forGoogle(args.range), ...borders }),
  });
  return { spreadsheetId: args.spreadsheetId };
}
