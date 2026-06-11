import { z } from 'zod';
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
  output: z.object({
    documentId: z.string().describe('The document the update was applied to.'),
    occurrencesChanged: z
      .number()
      .int()
      .describe('The number of occurrences changed by replacing all text.'),
    revisionId: z
      .string()
      .optional()
      .describe('The revision of the document after the write, when Google reports one.'),
  }),
};
