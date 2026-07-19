import type { sheets_v4 } from '@googleapis/sheets';
import type { z } from 'zod';
import {
  assertSingleBoundedMetadataDimension,
  projectDeveloperMetadata,
  toDeveloperMetadata,
} from '../../lib/metadata.js';
import { applyRequest } from '../../lib/requests.js';
import type { schema } from './schema.js';

export async function handler(
  sheets: sheets_v4.Sheets,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { spreadsheetId, ...developerMetadata } = args;
  assertSingleBoundedMetadataDimension(developerMetadata.location);
  const reply = await applyRequest(sheets, spreadsheetId, {
    createDeveloperMetadata: { developerMetadata: toDeveloperMetadata(developerMetadata) },
  });
  const created = reply.createDeveloperMetadata?.developerMetadata;
  if (!created) {
    throw new Error(
      'Google returned no developer metadata for the create; the metadata may not have been attached.',
    );
  }
  // A generated ID of zero can be omitted from a proto3 reply.
  const metadataId = created.metadataId ?? developerMetadata.metadataId ?? 0;
  return projectDeveloperMetadata({ ...created, metadataId });
}
