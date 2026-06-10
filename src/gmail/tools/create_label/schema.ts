import { z } from 'zod';
import { Label } from '../../entities/Label.js';
import { LabelColor } from '../../entities/LabelColor.js';

/** Source: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_label */
export const schema = {
  input: z.object({
    displayName: z.string().describe('The display name of the new label.'),
    color: LabelColor.optional(),
  }),
  output: Label,
};
