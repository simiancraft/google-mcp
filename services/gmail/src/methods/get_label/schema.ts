import { z } from 'zod';
import { Label } from '../../entities/Label.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/get */
export const input = z.object({
  labelId: z.string(),
});

export const output = Label;
