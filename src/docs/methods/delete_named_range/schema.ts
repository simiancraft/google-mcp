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
          'The ID of the named range to delete. Exactly one of namedRangeId and name must be provided.',
        ),
      name: z
        .string()
        .optional()
        .describe(
          'The name of the range(s) to delete: all named ranges with the given name are deleted. Exactly one of namedRangeId and name must be provided.',
        ),
    })
    .refine((input) => (input.namedRangeId === undefined) !== (input.name === undefined), {
      message: 'Exactly one of namedRangeId and name must be provided.',
    }),
  output: BatchUpdateReceipt,
};
