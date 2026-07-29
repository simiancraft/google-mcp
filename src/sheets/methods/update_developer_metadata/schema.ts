import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DeveloperMetadata } from '../../entities/DeveloperMetadata.js';
import { DeveloperMetadataInput } from '../../entities/DeveloperMetadataInput.js';

const UpdateFields = DeveloperMetadataInput.omit({ metadataId: true }).partial();

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the metadata.'),
    dataFilters: z
      .array(DataFilter)
      .min(1)
      .describe(
        'The filters selecting metadata entries to update; entries matching any filter are updated.',
      ),
    ...UpdateFields.shape,
  }),
  output: z.object({
    developerMetadata: z
      .array(DeveloperMetadata)
      .describe('Every developer metadata entry returned after the update.'),
  }),
};
