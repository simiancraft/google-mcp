import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteNamedRangeRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). A removal, so destructive per the unlabel
 * precedent, but identity-addressed (an id or a name, not a shifting
 * index), so idempotent: the name and the id address the same ranges no
 * matter how often the delete repeats. The text the range covered is
 * untouched; only the name comes off.
 */
export const delete_named_range = docsOperation({
  description:
    'Delete a named range by its ID, or every named range with a given name; the text the range covered is preserved, only the name is removed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteNamedRangeRequest',
  schema,
  handler,
});
