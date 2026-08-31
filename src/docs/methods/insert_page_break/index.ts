import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertPageBreakRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Additive but not idempotent: repeating the
 * insert adds another page break (and its following newline) each time.
 * Body-only by the API's contract, so no segmentId is exposed.
 */
export const insert_page_break = docsOperation({
  description:
    'Insert a page break followed by a newline into the document body, so the following content starts on a new page; page breaks cannot go inside tables, footnotes, headers, or footers.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertPageBreakRequest',
  schema,
  handler,
});
