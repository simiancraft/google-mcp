import { z } from 'zod';
import { BatchUpdateReceipt } from '../../entities/BatchUpdateReceipt.js';
import { Range } from '../../entities/Range.js';
import { SectionStyle } from '../../entities/SectionStyle.js';

export const schema = {
  input: z.strictObject({
    documentId: z.string().describe('The ID of the document to update.'),
    range: Range.describe(
      'The range overlapping the sections to style. Section breaks can only be inserted inside the body, so ranges here always address body content.',
    ),
    sectionStyle: SectionStyle.refine((style) => Object.keys(style).length > 0, {
      message: 'At least one style field must be provided.',
    }).describe(
      'The styles to set on every section the range overlaps. At least one field must be provided; the update mask is derived from the provided keys, so only those fields change. Certain changes may cause other changes in order to mirror the behavior of the Docs editor.',
    ),
  }),
  output: BatchUpdateReceipt,
};
