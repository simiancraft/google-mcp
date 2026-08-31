import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertInlineImageRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Additive but not idempotent (repeating inserts
 * another copy), and open-world: Google fetches the image from the provided
 * external URI at insertion time, the one Docs operation that reaches
 * outside the account.
 */
export const insert_inline_image = docsOperation({
  description:
    'Insert an image from a publicly accessible URI (PNG, JPEG, or GIF; under 50MB and 25 megapixels; URI at most 2 kB) into the body, a header, or a footer, optionally sized in points; Google fetches the image once at insertion time and returns the created objectId.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest',
  schema,
  handler,
});
