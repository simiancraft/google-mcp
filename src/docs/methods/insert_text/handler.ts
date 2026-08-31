import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { documentId, revisionId } = await applyUpdate(
    docs,
    args.documentId,
    args.index === undefined
      ? {
          insertText: {
            endOfSegmentLocation: forGoogle({ segmentId: args.segmentId }),
            text: args.text,
          },
        }
      : {
          insertText: {
            location: forGoogle({ index: args.index, segmentId: args.segmentId }),
            text: args.text,
          },
        },
  );
  return { documentId, revisionId };
}
