import { z } from 'zod';

/**
 * What text to find in the document: a plain substring with optional case
 * sensitivity. The REST criteria's `searchByRegex` is not exposed (issue #35).
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#SubstringMatchCriteria
 */
export const SubstringMatchCriteria = z.strictObject({
  text: z.string().min(1).describe('The text to search for in the document.'),
  matchCase: z
    .boolean()
    .optional()
    .describe('Whether the search respects case. Defaults to false (case-insensitive).'),
});

export type SubstringMatchCriteria = z.infer<typeof SubstringMatchCriteria>;
