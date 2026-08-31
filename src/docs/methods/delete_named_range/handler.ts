import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    deleteNamedRange: forGoogle({ namedRangeId: args.namedRangeId, name: args.name }),
  });
  return { documentId, revisionId };
}
