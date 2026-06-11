import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

export const schema = {
  input: z.object({
    draftId: z.string().describe('The id of the draft to retrieve.'),
  }),
  output: Draft,
};
