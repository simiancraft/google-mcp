import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { SubstringMatchCriteria } from '../../entities/SubstringMatchCriteria.js';

export const schema = {
  input: z.object({
    documentId: z.string().describe('The ID of the document to update.'),
    containsText: SubstringMatchCriteria.describe(
      'Finds text in the document matching this substring.',
    ),
    replaceText: z
      .string()
      .describe('The text that will replace the matched text; empty deletes the matches.'),
  }),
  output: BatchUpdateReceipt.extend({
    occurrencesChanged: z
      .number()
      .int()
      .describe('The number of occurrences changed by replacing all text.'),
  }),
};
