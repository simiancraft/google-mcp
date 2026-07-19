import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, namedRangeId, ...changes } = args;
  const fields = fieldPaths(changes, ['range']);
  if (fields === '') {
    throw new Error('Provide at least one named range field to update: name or range.');
  }
  await applyRequest(sheets, spreadsheetId, {
    updateNamedRange: {
      namedRange: forGoogle({
        namedRangeId,
        name: changes.name,
        range: changes.range ? forGoogle(changes.range) : undefined,
      }),
      fields,
    },
  });
  return { spreadsheetId, namedRangeId, updatedFields: fields };
}
