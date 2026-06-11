import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateParagraphStyleRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Applies to every paragraph the range overlaps;
 * only the provided fields change, and re-applying the same arguments yields
 * the same styling.
 */
export const update_paragraph_style = docsOperation({
  description:
    'Set paragraph styling (named style such as headings, alignment, line spacing) on every paragraph a range overlaps; only the provided fields change.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateParagraphStyleRequest',
  schema,
  handler,
});
