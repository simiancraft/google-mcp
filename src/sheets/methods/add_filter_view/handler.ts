import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectFilterView, toFilterView } from '../../lib/filtering.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if ((args.filter.range === undefined) === (args.filter.namedRangeId === undefined)) {
    throw new Error('Provide exactly one of range or namedRangeId in the filter view.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addFilterView: { filter: toFilterView(args.filter) },
  });
  const added = reply.addFilterView?.filter;
  if (!added) {
    throw new Error(
      'Google returned no filter view for the add; the view may not have been added.',
    );
  }
  const projected = projectFilterView(added);
  return {
    ...projected,
    // proto3 may omit the zero-valued ID; the caller-supplied identity is authoritative.
    filterViewId: added.filterViewId ?? args.filter.filterViewId ?? 0,
  };
}
