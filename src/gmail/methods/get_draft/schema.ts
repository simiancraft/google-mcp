import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

export const schema = {
  input: z.object({
    draftId: z.string(),
  }),
  output: Draft,
};
