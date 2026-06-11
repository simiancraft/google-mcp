import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One ReplaceAllTextRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). Destructive: the matched text is gone and the API has
 * no undo. Idempotent: a second run with the same arguments matches nothing.
 */
export const replace_all_text = docsOperation({
  description:
    'Replace every occurrence of a substring in the document, irreversibly; returns how many occurrences changed.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest',
  schema,
  handler,
});
