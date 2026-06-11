import { z } from 'zod';
import { Label } from '../../entities/Label.js';

export const schema = {
  input: z.strictObject({
    pageSize: z
      .number()
      .int()
      .optional()
      .describe(
        'Accepted for contract fidelity; the labels list is unpaginated, so this is never applied.',
      ),
    pageToken: z
      .string()
      .optional()
      .describe(
        'Accepted for contract fidelity; the labels list is unpaginated, so this is never applied.',
      ),
  }),
  output: z.object({
    labels: z.array(Label).describe('All labels on the account.'),
    nextPageToken: z
      .string()
      .optional()
      .describe('Never populated; the labels list is unpaginated.'),
  }),
};
