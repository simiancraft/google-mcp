import type { docs_v1 } from '@googleapis/docs';

/**
 * Apply exactly one update request via `documents.batchUpdate`: the shared
 * wrapper behind the curated text-editing operations (the rest of the
 * 40-variant request union is issue #35). Returns the raw response (callers
 * project their own reply) plus the identity every write reports: the
 * document id and, when Google supplies one, the post-write revision.
 */
export async function applyUpdate(
  docs: docs_v1.Docs,
  documentId: string,
  request: docs_v1.Schema$Request,
): Promise<{
  data: docs_v1.Schema$BatchUpdateDocumentResponse;
  documentId: string;
  revisionId: string | undefined;
}> {
  const { data } = await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests: [request] },
  });
  return {
    data,
    documentId: data.documentId ?? documentId,
    revisionId: data.writeControl?.requiredRevisionId ?? undefined,
  };
}
