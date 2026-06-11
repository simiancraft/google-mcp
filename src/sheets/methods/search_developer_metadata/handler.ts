import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectDataFilter, toGoogleDataFilter } from '../../lib/filters.js';
import { projectDeveloperMetadata } from '../../lib/metadata.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.developerMetadata.search({
    spreadsheetId: args.spreadsheetId,
    requestBody: { dataFilters: args.dataFilters.map(toGoogleDataFilter) },
  });
  return {
    matchedDeveloperMetadata: (data.matchedDeveloperMetadata ?? []).map((matched) => ({
      developerMetadata: matched.developerMetadata
        ? projectDeveloperMetadata(matched.developerMetadata)
        : undefined,
      dataFilters: matched.dataFilters ? matched.dataFilters.map(projectDataFilter) : undefined,
    })),
  };
}
