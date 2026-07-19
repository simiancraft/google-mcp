import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest } from '../../lib/requests.js';
import { projectProtectedRange, toEditors } from '../../lib/rules.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.range === undefined) === (args.namedRangeId === undefined)) {
    throw new Error('Provide exactly one of range or namedRangeId.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addProtectedRange: {
      protectedRange: forGoogle({
        range: args.range ? forGoogle(args.range) : undefined,
        namedRangeId: args.namedRangeId,
        description: args.description,
        warningOnly: args.warningOnly,
        unprotectedRanges: args.unprotectedRanges
          ? args.unprotectedRanges.map((range) => forGoogle(range))
          : undefined,
        editors: args.editors ? toEditors(args.editors) : undefined,
      }),
    },
  });
  return projectProtectedRange(reply.addProtectedRange?.protectedRange ?? {});
}
