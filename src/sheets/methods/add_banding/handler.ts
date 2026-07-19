import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectBandedRange, toBandedRange } from '../../lib/layout.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.rowProperties === undefined && args.columnProperties === undefined) {
    throw new Error('Provide rowProperties, columnProperties, or both.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addBanding: {
      bandedRange: toBandedRange({
        bandedRangeId: args.bandedRangeId,
        range: args.range,
        rowProperties: args.rowProperties,
        columnProperties: args.columnProperties,
      }),
    },
  });
  const added = reply.addBanding?.bandedRange;
  if (added?.bandedRangeId == null) {
    throw new Error(
      'Google returned no banded range with an ID for the add; the banding may not have been applied.',
    );
  }
  return projectBandedRange(added);
}
