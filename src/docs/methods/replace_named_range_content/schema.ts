import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';

export const schema = {
  input: z
    .strictObject({
      documentId: z.string().describe('The ID of the document to update.'),
      namedRangeId: z
        .string()
        .optional()
        .describe(
          'The ID of the named range whose content will be replaced. If there is no named range with the given ID, a 400 bad request error is returned. Exactly one of namedRangeId and namedRangeName must be provided.',
        ),
      namedRangeName: z
        .string()
        .optional()
        .describe(
          'The name of the NamedRanges whose content will be replaced: the content of every named range with the given name is replaced, and if none exist the request is a no-op. Exactly one of namedRangeId and namedRangeName must be provided.',
        ),
      text: z
        .string()
        .describe('The text that replaces the content of the specified named range(s).'),
    })
    .refine(
      (input) => (input.namedRangeId === undefined) !== (input.namedRangeName === undefined),
      {
        message: 'Exactly one of namedRangeId and namedRangeName must be provided.',
      },
    ),
  output: BatchUpdateReceipt,
};
