import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectDimensionGroup, toDimensionRange } from '../../lib/layout.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  if (args.range.endIndex <= args.range.startIndex) {
    throw new Error('range.endIndex must be greater than range.startIndex.');
  }
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    addDimensionGroup: { range: toDimensionRange(args.range) },
  });
  const groups = reply.addDimensionGroup?.dimensionGroups;
  if (!groups) {
    throw new Error(
      'Google returned no dimension groups for the add; the grouping may not have been applied.',
    );
  }
  return { dimensionGroups: groups.map(projectDimensionGroup) };
}
