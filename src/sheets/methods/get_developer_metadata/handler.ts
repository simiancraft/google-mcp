import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import { projectDeveloperMetadata } from '../../lib/metadata.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await sheets.spreadsheets.developerMetadata.get({
    spreadsheetId: args.spreadsheetId,
    metadataId: args.metadataId,
  });
  return projectDeveloperMetadata(data);
}
