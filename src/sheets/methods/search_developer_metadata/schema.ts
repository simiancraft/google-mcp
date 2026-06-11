import { z } from 'zod';
import { DataFilter } from '../../entities/DataFilter.js';
import { DeveloperMetadata } from '../../entities/DeveloperMetadata.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve metadata from.'),
    dataFilters: z
      .array(DataFilter)
      .min(1)
      .describe(
        'The criteria for the metadata to return: a developer-metadata lookup matches the entries it selects; an A1 or grid range matches all metadata associated with intersecting locations.',
      ),
  }),
  output: z.object({
    matchedDeveloperMetadata: z
      .array(
        z.object({
          developerMetadata: DeveloperMetadata.optional().describe(
            'The developer metadata matching the specified filters.',
          ),
          dataFilters: z
            .array(DataFilter)
            .optional()
            .describe('All filters matching the returned developer metadata.'),
        }),
      )
      .describe('The metadata matching the criteria of the search request.'),
  }),
};
