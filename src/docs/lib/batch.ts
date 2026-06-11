import type { docs_v1 } from '@googleapis/docs';

/**
 * Apply exactly one update request via `documents.batchUpdate`: the shared
 * wrapper behind the curated text-editing operations (the rest of the
 * 40-variant request union is issue #35). Replies map 1:1 with requests, so
 * exactly one request means exactly one reply; surfacing it here keeps the
 * `[0]` next to the invariant it depends on. Also returns the identity every
 * write reports: the document id and, when Google supplies one, the
 * post-write revision.
 */
export async function applyUpdate(
  docs: docs_v1.Docs,
  documentId: string,
  request: docs_v1.Schema$Request,
): Promise<{
  reply: docs_v1.Schema$Response | undefined;
  documentId: string;
  revisionId: string | undefined;
}> {
  const { data } = await docs.documents.batchUpdate({
    documentId,
    requestBody: { requests: [request] },
  });
  return {
    reply: data.replies?.[0],
    documentId: data.documentId ?? documentId,
    revisionId: data.writeControl?.requiredRevisionId ?? undefined,
  };
}
