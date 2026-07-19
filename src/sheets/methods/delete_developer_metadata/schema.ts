import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DeveloperMetadata } from '../../entities/DeveloperMetadata.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet containing the metadata.'),
    dataFilter: DataFilter.describe(
      'The irreversible criteria selecting metadata to delete; every matching entry is deleted. An empty developerMetadataLookup matches all developer metadata visible to the requesting project, so that empty lookup deletes every visible entry.',
    ),
  }),
  output: z.object({
    deletedDeveloperMetadata: z
      .array(DeveloperMetadata)
      .describe('Every developer metadata entry deleted by the filter.'),
  }),
};
