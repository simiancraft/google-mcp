import { z } from 'zod';
import { DeveloperMetadata } from '../../entities/DeveloperMetadata.js';

/** Source: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.developerMetadata/get */
export const schema = {
  input: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to retrieve metadata from.'),
    metadataId: z.number().int().describe('The ID of the developer metadata to retrieve.'),
  }),
  output: DeveloperMetadata,
};
