import { z } from 'zod';

/**
 * What every curated write reports: the document the update was applied to
 * and, when Google supplies one, the post-write revision. A projection of the
 * REST BatchUpdateDocumentResponse, produced by `lib/batch.ts`.
 *
 * @see https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate#response-body
 */
export const BatchUpdateReceipt = z.object({
  documentId: z.string().describe('The document the update was applied to.'),
  revisionId: z
    .string()
    .optional()
    .describe('The revision of the document after the write, when Google reports one.'),
});

export type BatchUpdateReceipt = z.infer<typeof BatchUpdateReceipt>;
