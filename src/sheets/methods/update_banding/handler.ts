import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toBandedRange } from '../../lib/layout.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, bandedRangeId, ...changes } = args;
  const fields = fieldPaths(changes, ['range', 'rowProperties', 'columnProperties']);
  if (fields === '') {
    throw new Error('Provide at least one banded range field to update.');
  }
  await applyRequest(sheets, spreadsheetId, {
    updateBanding: {
      bandedRange: toBandedRange({ bandedRangeId, ...changes }),
      fields,
    },
  });
  return { spreadsheetId, bandedRangeId, updatedFields: fields };
}
