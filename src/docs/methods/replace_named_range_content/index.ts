import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One ReplaceNamedRangeContentRequest applied via `documents.batchUpdate`
 * (the curated subset; issue #35). Destructive — the ranges' existing
 * content is gone, and where a named range consists of multiple
 * discontinuous ranges, only the first is replaced and the others are
 * deleted with their content — but identity-addressed and therefore
 * idempotent: repeating with the same text replaces identical content with
 * itself (unlike replace_all_text, whose matches can regrow).
 */
export const replace_named_range_content = docsOperation({
  description:
    'Replace the content of a named range (by ID, or of every range with a given name) with the given text: the template-fill primitive, targeting by stable handle instead of shifting indices. Replacing by a name that matches nothing is a no-op.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#ReplaceNamedRangeContentRequest',
  schema,
  handler,
});
