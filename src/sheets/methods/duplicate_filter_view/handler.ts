import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectFilterView } from '../../lib/filtering.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const reply = await applyRequest(sheets, args.spreadsheetId, {
    duplicateFilterView: { filterId: args.filterId },
  });
  const duplicated = reply.duplicateFilterView?.filter;
  if (!duplicated) {
    throw new Error(
      'Google returned no filter view for the duplicate; the view may not have been duplicated.',
    );
  }
  const projected = projectFilterView(duplicated);
  return {
    ...projected,
    // A generated zero-valued ID can be omitted by proto3; keep the identity total.
    filterViewId: duplicated.filterViewId ?? 0,
  };
}
