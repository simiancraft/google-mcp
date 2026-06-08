import { z } from 'zod';
import { Draft } from '../../entities/Draft.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/get */
export const schema = {
  input: z.object({
    draftId: z.string(),
  }),
  output: Draft,
};
