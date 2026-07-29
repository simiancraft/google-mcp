import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import { toEditors } from '../../lib/rules.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, protectedRangeId, ...changes } = args;
  if (changes.range !== undefined && changes.namedRangeId !== undefined) {
    throw new Error('Provide at most one of range or namedRangeId.');
  }
  const fields = fieldPaths(changes);
  if (fields === '') {
    throw new Error(
      'Provide at least one field to update: range, namedRangeId, description, warningOnly, unprotectedRanges, or editors.',
    );
  }
  await applyRequest(sheets, spreadsheetId, {
    updateProtectedRange: {
      protectedRange: forGoogle({
        protectedRangeId,
        range: changes.range ? forGoogle(changes.range) : undefined,
        namedRangeId: changes.namedRangeId,
        description: changes.description,
        warningOnly: changes.warningOnly,
        unprotectedRanges: changes.unprotectedRanges
          ? changes.unprotectedRanges.map((range) => forGoogle(range))
          : undefined,
        editors: changes.editors ? toEditors(changes.editors) : undefined,
      }),
      fields,
    },
  });
  return { spreadsheetId, protectedRangeId, updatedFields: fields };
}
