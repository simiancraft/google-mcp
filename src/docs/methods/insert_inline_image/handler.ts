import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { applyUpdate } from '../../lib/batch.js';
import { pt } from '../../lib/dimension.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const objectSize =
    args.width === undefined && args.height === undefined
      ? undefined
      : forGoogle({ width: pt(args.width), height: pt(args.height) });
  const { reply, documentId, revisionId } = await applyUpdate(docs, args.documentId, {
    insertInlineImage: forGoogle({
      uri: args.uri,
      objectSize,
      ...(args.index === undefined
        ? { endOfSegmentLocation: forGoogle({ segmentId: args.segmentId }) }
        : { location: forGoogle({ index: args.index, segmentId: args.segmentId }) }),
    }),
  });
  return {
    documentId,
    revisionId,
    objectId: reply?.insertInlineImage?.objectId ?? '',
  };
}
