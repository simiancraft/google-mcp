import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateNamedRangeRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Additive but not idempotent: names are not
 * unique, so repeating the create adds another named range with the same
 * name each time.
 */
export const create_named_range = docsOperation({
  description:
    'Name a range of the document, returning a namedRangeId: a stable handle that survives index shifts, so later edits (replace_named_range_content, delete_named_range) can target the region without recomputing indices.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateNamedRangeRequest',
  schema,
  handler,
});
