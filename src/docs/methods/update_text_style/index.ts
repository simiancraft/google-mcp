import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateTextStyleRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Only the provided style fields change; re-applying the
 * same arguments yields the same styling, so the operation is idempotent.
 */
export const update_text_style = docsOperation({
  description:
    'Set character styling (bold, italic, underline, strikethrough, small caps, baseline offset, font size, link) on a range of text; only the provided fields change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTextStyleRequest',
  schema,
  handler,
});
