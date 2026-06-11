import { z } from 'zod';
import { Document } from '../../entities/Document.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to retrieve.'),
  }),
  output: Document,
};
