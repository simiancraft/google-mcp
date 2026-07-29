import { z } from 'zod';
import { GridRange } from '../../entities/GridRange.js';
import { SourceAndDestination } from '../../entities/SourceAndDestination.js';

export const schema = {
  input: z.strictObject({
    spreadsheetId: z.string().describe('The ID of the spreadsheet to autofill.'),
    useAlternateSeries: z
      .boolean()
      .optional()
      .describe('True to generate the alternate series for the detected source data.'),
    range: GridRange.optional().describe(
      'A range whose existing data seed should be detected and extended through the rest of the range. Provide exactly one of range or sourceAndDestination.',
    ),
    sourceAndDestination: SourceAndDestination.optional().describe(
      'An explicit source, fill dimension, and fill length. Provide exactly one of range or sourceAndDestination.',
    ),
  }),
  output: z.object({
    spreadsheetId: z.string().describe('The ID of the spreadsheet that was updated.'),
  }),
};
