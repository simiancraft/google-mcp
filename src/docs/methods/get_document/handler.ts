import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { projectDocument } from '../../lib/document.js';
import type { schema } from './schema.js';

export async function handler(
  docs: docs_v1.Docs,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await docs.documents.get({ documentId: args.documentId });
  return projectDocument(data);
}
