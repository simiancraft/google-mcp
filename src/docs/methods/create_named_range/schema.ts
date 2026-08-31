import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Range } from '../../entities/Range.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    name: z
      .string()
      .min(1)
      .max(256)
      .describe(
        'The name of the NamedRange. Names do not need to be unique; must be at least 1 character and no more than 256 characters, measured in UTF-16 code units.',
      ),
    range: Range.describe('The range to apply the name to.'),
  }),
  output: BatchUpdateReceipt.extend({
    namedRangeId: z
      .string()
      .describe(
        'The ID of the created named range; the stable handle delete_named_range and replace_named_range_content take.',
      ),
  }),
};
