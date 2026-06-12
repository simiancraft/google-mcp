import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { paragraphStyle } = args;
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    updateParagraphStyle: {
      range: args.range,
      paragraphStyle: forGoogle(paragraphStyle),
      // Derived from the provided keys (the REST JSON field names), so mask
      // and values cannot desync.
      fields: Object.keys(paragraphStyle).join(','),
    },
  });
  return { documentId, revisionId };
}
