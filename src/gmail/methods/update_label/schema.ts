import { z } from 'zod';
import { Label } from '../../entities/Label.js';
import { LabelColor } from '../../entities/LabelColor.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/patch */
export const schema = {
  input: z.object({
    labelId: z.string(),
    name: z.string().optional().describe('New display name.'),
    color: LabelColor.optional(),
  }),
  output: Label,
};
