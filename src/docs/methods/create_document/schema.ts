import { z } from 'zod';
import { Document } from '../../entities/Document.js';

/**
 * The REST body is a full Document resource, but `documents.create` uses only
 * `title` and ignores everything else, including content; the input says so
 * rather than accepting fields the API would drop.
 */
export const schema = {
  input: z.strictObject({
    title: z
      .string()
      .describe(
        'The title of the document. The API ignores any other creation fields, including content; populate the body with the editing operations.',
      ),
  }),
  output: Document,
};
