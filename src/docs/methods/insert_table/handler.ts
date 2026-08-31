import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { applyUpdate } from '../../lib/batch.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const table = { rows: args.rows, columns: args.columns };
  const { documentId, revisionId } = await applyUpdate(
    docs,
    args.documentId,
    args.index === undefined
      ? { insertTable: { endOfSegmentLocation: {}, ...table } }
      : { insertTable: { location: { index: args.index }, ...table } },
  );
  return { documentId, revisionId };
}
