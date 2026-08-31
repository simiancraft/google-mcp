import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One ReplaceImageRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Destructive — the old image (and some of its effects,
 * mirroring the Docs editor) is gone — but identity-addressed and
 * idempotent: repeating with the same URI replaces the image with the same
 * content. Open-world: Google fetches the new image from the provided
 * external URI.
 */
export const replace_image = docsOperation({
  description:
    'Replace an existing image, keeping its rendered size: the new image (PNG, JPEG, or GIF from a publicly accessible URI; under 50MB and 25 megapixels) is scaled and center-cropped to fill the original bounds; the old image and some of its effects are removed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest',
  schema,
  handler,
});
