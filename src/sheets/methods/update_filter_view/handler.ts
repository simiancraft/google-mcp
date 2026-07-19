import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toFilterView } from '../../lib/filtering.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, filterViewId, ...changes } = args;
  const fields = fieldPaths(changes, ['range']);
  if (fields === '') throw new Error('Provide at least one field to update.');
  await applyRequest(sheets, spreadsheetId, {
    updateFilterView: {
      filter: toFilterView({ filterViewId, ...changes }),
      fields,
    },
  });
  return { spreadsheetId, filterViewId, updatedFields: fields };
}
