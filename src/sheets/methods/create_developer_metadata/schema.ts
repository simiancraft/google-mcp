import { z } from 'zod';
import { DeveloperMetadata } from '../../entities/DeveloperMetadata.js';
import { DeveloperMetadataInput } from '../../entities/DeveloperMetadataInput.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to attach metadata to.'),
    ...DeveloperMetadataInput.shape,
  }),
  output: DeveloperMetadata,
};
