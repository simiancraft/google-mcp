import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { toGoogleDataFilter } from '../../lib/filters.js';
import {
  assertSingleBoundedMetadataDimension,
  projectDeveloperMetadata,
  toDeveloperMetadata,
} from '../../lib/metadata.js';
import { applyRequest, fieldPaths } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, dataFilters, ...changes } = args;
  assertSingleBoundedMetadataDimension(changes.location);
  const fields = fieldPaths(changes, ['location']);
  if (fields === '') {
    throw new Error(
      'Provide at least one developer metadata field to update: metadataKey, metadataValue, location, or visibility.',
    );
  }
  const reply = await applyRequest(sheets, spreadsheetId, {
    updateDeveloperMetadata: {
      dataFilters: dataFilters.map(toGoogleDataFilter),
      developerMetadata: toDeveloperMetadata(changes),
      fields,
    },
  });
  return {
    developerMetadata: (reply.updateDeveloperMetadata?.developerMetadata ?? []).map(
      projectDeveloperMetadata,
    ),
  };
}
