import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.range === undefined) === (args.sourceAndDestination === undefined)) {
    throw new Error('Provide exactly one of range or sourceAndDestination.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    autoFill: forGoogle({
      useAlternateSeries: args.useAlternateSeries,
      range: args.range ? forGoogle(args.range) : undefined,
      sourceAndDestination: args.sourceAndDestination
        ? {
            source: forGoogle(args.sourceAndDestination.source),
            dimension: args.sourceAndDestination.dimension,
            fillLength: args.sourceAndDestination.fillLength,
          }
        : undefined,
    }),
  });
  return { spreadsheetId: args.spreadsheetId };
}
