import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import { toSlicerSpec } from '../../lib/slicers.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // An explicitly empty filterCriteria is a reset: fieldPaths' expansion
  // yields no subpaths for an empty object, so mask the whole field instead,
  // which clears the slicer's filter.
  const clearingFilter =
    args.spec.filterCriteria !== undefined && Object.keys(args.spec.filterCriteria).length === 0;
  const expanded = fieldPaths(args.spec, [
    'dataRange',
    ...(clearingFilter ? [] : (['filterCriteria'] as const)),
    'textFormat',
  ]);
  const fields = clearingFilter
    ? [expanded, 'filterCriteria'].filter((path) => path !== '').join(',')
    : expanded;
  if (fields === '') {
    throw new Error('Provide at least one slicer spec field to update.');
  }
  await applyRequest(sheets, args.spreadsheetId, {
    updateSlicerSpec: {
      slicerId: args.slicerId,
      spec: toSlicerSpec(args.spec),
      fields,
    },
  });
  return {
    spreadsheetId: args.spreadsheetId,
    slicerId: args.slicerId,
    updatedFields: fields,
  };
}
