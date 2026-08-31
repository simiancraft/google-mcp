import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeletePositionedObjectRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). A removal, so destructive, but
 * identity-addressed by objectId and therefore idempotent per the unlabel
 * precedent. The API can only delete positioned objects (images anchored to
 * a paragraph and wrapped by text); creating them is a Docs-editor-only
 * feature, which is why no insert counterpart exists.
 */
export const delete_positioned_object = docsOperation({
  description:
    'Delete a positioned object (an image anchored to a paragraph with text wrapping, created in the Docs editor) by its objectId.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeletePositionedObjectRequest',
  schema,
  handler,
});
